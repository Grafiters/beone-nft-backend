import { PaymentDetailsEntities } from '@db/entity/payment_details';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentDtoParams } from '@params/function/staked-contract';
import { EntityManager, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { BlockchainService } from '@services/blockchain/blockchain.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(PaymentDetailsEntities)
    private readonly paymentRepository: Repository<PaymentDetailsEntities>,
    private readonly userService: UserService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async fetchPaymentByID(id: number): Promise<PaymentDetailsEntities> {
    this.logger.debug('fetch single data payment');
    return await this.paymentRepository.findOneBy({ id: id });
  }

  async payment(
    params: PaymentDtoParams,
    manager?: EntityManager,
  ): Promise<PaymentDetailsEntities | null> {
    const paymentRepo = manager
      ? manager.getRepository(PaymentDetailsEntities)
      : this.paymentRepository;
    const paymentParams = {
      user_id: params.user_id,
      amount: params.amount.toNumber(),
      from: params.from,
      contract_address: params.contract_address,
      hash: params.hash,
      to: params.to,
      status: params.status,
    };

    const create = paymentRepo.create(paymentParams);
    try {
      const save = await paymentRepo.save(create);
      return save;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
