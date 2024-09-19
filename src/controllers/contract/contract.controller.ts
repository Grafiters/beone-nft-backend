import { ConfigServices } from '@db/models/config/config.service';
import { PaymentsService } from '@db/models/payments/payments.service';
import { StakedService } from '@db/models/staked/staked.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { ContractsService } from '@services/contracts/contracts.service';
import { isValidHash } from '@tools/hash-validation';
import { plainToInstance } from 'class-transformer';
import Decimal from 'decimal.js';
import { DataSource, QueryRunner } from 'typeorm';

@ApiTags('contract')
@Controller('contract')
export class ContractController {
  private readonly logger = new Logger(ContractController.name);
  constructor(
    private readonly stakedService: StakedService,
    private readonly blockchainService: BlockchainService,
    private readonly contractService: ContractsService,
    private readonly paymentService: PaymentsService,
    private readonly configService: ConfigServices,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @ApiOperation({ summary: `user public get list of staked deployed` })
  @ApiOkResponse({ type: StakedResponse })
  async staked(): Promise<StakedResponse[]> {
    const stake = await this.stakedService.fetchAll('');

    const stakeDto = await Promise.all(
      stake.map(async (st) => {
        const stakedResponse = await StakedResponse.fromStaked(st);

        return stakedResponse;
      }),
    );

    const removeBigInt = JSON.parse(
      JSON.stringify(stakeDto, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    return removeBigInt;
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
      stake.map(async (st) => {
        const stakedResponse = await StakedResponse.fromStaked(st);

        return stakedResponse;
      }),
    );

    const removeBigInt = JSON.parse(
      JSON.stringify(stakeDto, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    return removeBigInt;
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
    const addressValid = isValidHash(hash);
    if (!addressValid) {
      throw new HttpException(
        {
          status: 422,
          message: `Request invalid hash transaction, hash transaction must have prefix 0x but the request is ${hash}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tx_blockchain =
        await this.blockchainService.fetchTransactionPayment({
          hash: hash,
          provider: user.provider,
        });

      if (tx_blockchain === null) {
        throw new HttpException(
          {
            status: 422,
            message: `Transaction hash ${hash} is not valid or cannot detect in binance ${process.env.NETWORK}blockchain network`,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const config = await this.configService.findConfig('amount_payment');
      const payment = await this.configService.findConfig(
        'payment_contract_address',
      );
      const amount_payment_decimal = new Decimal(config.value);

      if (tx_blockchain.from != user.address) {
        throw new HttpException(
          {
            status: 422,
            message: `user is not payer for deploy stake contract address`,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (tx_blockchain.contract_address != payment.value) {
        throw new HttpException(
          {
            status: 422,
            message: `address ${tx_blockchain.contract_address} its different address payment, payment address exists is ${payment.value} but the transaction address is ${tx_blockchain.contract_address}`,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (
        !tx_blockchain.status ||
        tx_blockchain.amount.lessThan(amount_payment_decimal)
      ) {
        throw new HttpException(
          {
            status: 422,
            message: `cannot process payment value is under of or status transaction not success`,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      let status: PaymentStatus = PaymentStatus.Pending;
      let payment_success: number | null = null;
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

      const deploy = await this.blockchainService.deploySmartContract();

      const create = await this.paymentService.payment(
        params,
        queryRunner.manager,
      );
      if (create) {
        const staked_contract = await this.stakedService.init_staked_contract({
          user_id: user.id,
          contract_address: deploy,
          payment_detail_id: create.id,
        });

        if (typeof staked_contract !== 'string') {
          const dto =
            await ContractCreateResponse.fromContract(staked_contract);
          const dtos = plainToInstance(ContractCreateResponse, dto);
          await queryRunner.commitTransaction();
          return dtos;
        } else {
          throw new HttpException(
            {
              status: 422,
              message: 'cannot process payment and deploying contract',
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }
    } catch (error) {
      this.logger.error(`errored create payment => ${error}`);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          status: 422,
          message: `cannot process payment and deploying contract cause invalid transaction hash for payment or ${error}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } finally {
      // Release the query runner after the transaction is completed
      await queryRunner.release();
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
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const {
      contract_address,
      staked_token,
      reward_token,
      reward_per_block,
      start_block,
      bonus_block_end,
      locking,
    } = body;
    const addressValid = isValidHash(contract_address);
    if (!addressValid) {
      throw new HttpException(
        {
          status: 422,
          message: `Request invalid contract address, contract address must have prefix 0x but the request is ${contract_address}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const stakeValid = isValidHash(staked_token);
    if (!stakeValid) {
      throw new HttpException(
        {
          status: 422,
          message: `Request invalid staked contract address, contract address must have prefix 0x but the request is ${staked_token}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const rewardValid = isValidHash(reward_token);
    if (!rewardValid) {
      throw new HttpException(
        {
          status: 422,
          message: `Request invalid reward contract address, contract address must have prefix 0x but the request is ${reward_token}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const stakedAddress = await this.stakedService.fetchByUserAndContract(
      user.id,
      contract_address,
    );

    if (stakedAddress === null || stakedAddress.status != 'pending') {
      throw new HttpException(
        {
          status: 422,
          message: `Request invalid staked contract pending, user has no pending staked smart contract or staked contract address is invalid or have not made payment`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const min_diff_block = await this.configService.findConfig(
      'min_diff_block_start',
    );
    const currentBlock = await this.blockchainService.getCurrentBlock();
    const diff_block = start_block - currentBlock;
    if (parseInt(min_diff_block.value) > diff_block) {
      throw new HttpException(
        {
          status: 422,
          message: `start_block must be greather then min_diff_block from configs the request diff block is ${start_block} and the minimum different block is ${parseInt(min_diff_block.value)} the different is ${diff_block}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const min_block_end = await this.configService.findConfig('min_block_end');
    if (parseInt(min_block_end.value) > bonus_block_end - diff_block) {
      throw new HttpException(
        {
          status: 422,
          message: `block_end must be greater then bonus_block_end from configs the request is ${bonus_block_end} the different with minimum block end is ${bonus_block_end - diff_block} and the minimum is ${parseInt(min_block_end.value)}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const min_block_reward =
      await this.configService.findConfig('min_block_reward');

    const rewardToDecimal = new Decimal(reward_per_block);
    const recordToDecimal = new Decimal(min_block_reward.value);
    if (recordToDecimal.greaterThan(rewardToDecimal)) {
      throw new HttpException(
        {
          status: 422,
          message: `min_block_reward mus be greater then min_block_reward from configs the min reward is ${min_block_reward}`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      const initialize = await this.contractService.initialize_contract({
        contract_address: contract_address,
        hash_initialize: '',
        staked_token: staked_token,
        reward_token: reward_token,
        reward_per_block: reward_per_block,
        bonus_end_block: bonus_block_end,
        start_block: start_block,
        status: StakedStatus.Success,
        user_id: 0,
        payment_detail_id: 0,
        locking: locking,
      });

      if (initialize) {
        const params: StakedContractInitialize = {
          user_id: user.id,
          payment_detail_id: 0,
          hash_initialize: initialize,
          contract_address: contract_address,
          staked_token: staked_token,
          reward_token: reward_token,
          reward_per_block: reward_per_block,
          bonus_end_block: bonus_block_end,
          start_block: start_block,
          status: StakedStatus.Success,
          locking: locking,
        };
        const create = await this.stakedService.initialize_contract(
          params,
          queryRunner.manager,
        );
        if (create) {
          const dto = await StakedResponse.fromStaked(create);
          const removeBigInt = JSON.parse(
            JSON.stringify(dto, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value,
            ),
          );
          const dtos = plainToInstance(StakedResponse, removeBigInt);

          await queryRunner.commitTransaction();

          return dtos;
        }
      } else {
        this.logger.debug(initialize);
      }
    } catch (error) {
      this.logger.error(
        `errored when initialize smart contract stake => ${error}`,
      );

      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          status: 422,
          message: error,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } finally {
      // Release the query runner after the transaction is completed
      await queryRunner.release();
    }
  }
}
