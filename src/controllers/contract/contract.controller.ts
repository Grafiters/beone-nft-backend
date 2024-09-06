import { ConfigServices } from '@db/models/config/config.service';
import { PaymentsService } from '@db/models/payments/payments.service';
import { StakedService } from '@db/models/staked/staked.service';
import { UserService } from '@db/models/user/user.service';
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  PaymentDtoParams,
  PaymentStatus,
  StakedContractInitialize,
  StakedStatus,
} from '@params/function/staked-contract';
import { PaymentRequest } from '@params/request/payment-stack-request.dto';
import { StakedRequest } from '@params/request/staked-data-request.dto';
import { ContractCreateResponse } from '@params/response/contract-create-response.dto';
import { GeneralResponse } from '@params/response/general-response.dto';
import { StakedResponse } from '@params/response/staked-response.dto';
import { AuthGuard } from '@services/auth/auth.guard';
import { BlockchainService } from '@services/blockchain/blockchain.service';
import { plainToInstance } from 'class-transformer';
import Decimal from 'decimal.js';

@ApiTags('contract')
@Controller('contract')
export class ContractController {
  private readonly logger = new Logger(ContractController.name);
  constructor(
    private readonly userService: UserService,
    private readonly stakedService: StakedService,
    private readonly blockchainService: BlockchainService,
    private readonly paymentService: PaymentsService,
    private readonly configService: ConfigServices,
  ) {}

  @Get()
  @ApiOperation({ summary: `user public get list of staked deployed` })
  @ApiOkResponse({ type: StakedResponse })
  async staked(): Promise<StakedResponse[]> {
    const stake = await this.stakedService.fetchAll('');
    const stakeDto = await Promise.all(
      stake.map((st) => StakedResponse.fromStaked(st)),
    );

    const dto = plainToInstance(StakedResponse, stakeDto);
    return dto;
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: `user get list of staked deployed` })
  @ApiOkResponse({ type: StakedResponse })
  async staked_user(@Request() req: any): Promise<StakedResponse[]> {
    const user = JSON.parse(req.headers['users']);
    const stake = await this.stakedService.fetchAll({ user_id: user.id });
    const stakeDto = await Promise.all(
      stake.map((st) => StakedResponse.fromStaked(st)),
    );

    const dto = plainToInstance(StakedResponse, stakeDto);
    return dto;
  }

  @Post('payment')
  @ApiOperation({
    summary: `user make payment for init stake contract address`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ContractCreateResponse })
  async payment(
    @Request() req: any,
    @Body() body: PaymentRequest,
  ): Promise<ContractCreateResponse | GeneralResponse> {
    const { hash } = body;
    const user = JSON.parse(req.headers['users']);
    try {
      const tx_blockchain =
        await this.blockchainService.fetchTransactionPayment({
          hash: hash,
          provider: user.provider,
        });

      if (tx_blockchain == null) {
        const response: GeneralResponse = {
          status: 422,
          message: `transaction hash ${hash} is not valid or cannot detect in blockchain network`,
        };
        return response;
      }

      const config = await this.configService.findConfig('amount_payment');
      const payment = await this.configService.findConfig('payer_address');
      const amount_payment_decimal = new Decimal(config.value);

      if (tx_blockchain.to != payment.value) {
        const response: GeneralResponse = {
          status: 422,
          message: `address ${tx_blockchain.to} its different address payment, payment address exists is ${payment.value} but the transaction address is ${tx_blockchain.to}`,
        };
        return response;
      }

      if (
        !tx_blockchain.status ||
        tx_blockchain.amount.lessThan(amount_payment_decimal)
      ) {
        const response: GeneralResponse = {
          status: 422,
          message: `cannot process payment value is under of or status transaction not success`,
        };
        return response;
      }

      let status: PaymentStatus = PaymentStatus.Pending;
      let payment_success = null;
      if (tx_blockchain.status) {
        status = PaymentStatus.Approved;
        payment_success = Date.now();
      }

      const params: PaymentDtoParams = {
        user_id: user.id,
        hash: hash,
        contract_address: tx_blockchain.contract_address,
        from: tx_blockchain.from,
        to: tx_blockchain.to,
        amount: tx_blockchain.amount,
        status: status,
        payment_success_at: payment_success,
      };

      const create = await this.paymentService.payment(params);
      if (create) {
        const dto = await ContractCreateResponse.fromContract(create);
        const dtos = plainToInstance(ContractCreateResponse, dto);
        return dtos;
      }
    } catch (error) {
      this.logger.error(`errored create payment => ${error}`);
      const response: GeneralResponse = {
        status: 422,
        message: 'cannot process payment and deploying contract',
      };

      return response;
    }
  }

  @Post('staked')
  @ApiOperation({
    summary: `user make payment for init stake contract address`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: StakedResponse })
  @ApiUnprocessableEntityResponse({ type: GeneralResponse })
  async init_staked(
    @Request() req: any,
    @Body() body: StakedRequest,
  ): Promise<StakedResponse | GeneralResponse> {
    const user = JSON.parse(req.headers['users']);
    const {
      contract_address,
      name,
      symbol,
      staked_token,
      reward_token,
      reward_per_block,
      start_block,
      bonus_block_end,
    } = body;
    const diff_block = await this.configService.findConfig(
      'min_diff_block_start',
    );

    if (parseInt(diff_block.value) > start_block) {
      const response: GeneralResponse = {
        status: 422,
        message: `start_block must be greather then min_diff_block from configs the request diff block is ${start_block}`,
      };
      return response;
    }

    const min_block_end = await this.configService.findConfig('min_block_end');
    if (parseInt(min_block_end.value) > bonus_block_end) {
      const response: GeneralResponse = {
        status: 422,
        message: `block_end must be greater then bonus_block_end from configs the request is ${bonus_block_end}`,
      };
      return response;
    }

    const min_block_reward =
      await this.configService.findConfig('min_block_reward');

    const rewardToDecimal = new Decimal(reward_per_block);
    const recordToDecimal = new Decimal(min_block_reward.value);
    if (recordToDecimal.greaterThan(rewardToDecimal)) {
      const response: GeneralResponse = {
        status: 422,
        message: `min_block_reward mus be greater then min_block_reward from configs the min reward is ${min_block_reward}`,
      };
      return response;
    }

    const params: StakedContractInitialize = {
      user_id: user.id,
      payment_detail_id: 0,
      contract_address: contract_address,
      name: name,
      symbol: symbol,
      staked_token: staked_token,
      reward_token: reward_token,
      reward_per_block: reward_per_block,
      bonus_end_block: bonus_block_end,
      start_block: start_block,
      status: StakedStatus.Success,
    };

    try {
      const create = await this.stakedService.initialize_contract(params);
      if (create) {
        const dto = await StakedResponse.fromStaked(create);
        const dtos = plainToInstance(StakedResponse, dto);

        return dtos;
      }
    } catch (error) {
      this.logger.error(
        `errored when initialize smart contract stake => ${error}`,
      );

      const response: GeneralResponse = {
        status: 422,
        message: error,
      };

      return response;
    }
  }
}
