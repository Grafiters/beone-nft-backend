import { StakedContractEntities } from '@db/entity/staked_contract.entity';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import {
  PaymentDtoParams,
  StakedContractInitialize,
} from '@params/function/staked-contract';
import { applyDynamicFilters } from '@tools/query-builder';

@Injectable()
export class StakedService {
  private readonly logger = new Logger(StakedService.name);

  constructor(
    @InjectRepository(StakedContractEntities)
    private readonly stakedRepository: Repository<StakedContractEntities>,
    private readonly userService: UserService,
  ) {}

  async fetchAll(filters: {
    [key: string]: any;
  }): Promise<StakedContractEntities[] | []> {
    const staked_data =
      this.stakedRepository.createQueryBuilder('staked_contracts');

    applyDynamicFilters(staked_data, filters, 'staked_contracts');

    const staked = await staked_data.getMany();
    return staked.length > 0 ? staked : [];
  }

  async fetchAllByUser(
    userId: number,
    filters: {
      [key: string]: any;
    },
  ): Promise<StakedContractEntities[] | []> {
    const staked_data = this.stakedRepository
      .createQueryBuilder('staked_contracts')
      .andWhere(`user_id = :${userId}`);

    applyDynamicFilters(staked_data, filters, 'staked_contracts');

    const staked = await staked_data.getMany();
    return staked.length > 0 ? staked : [];
  }

  async payment(
    paymentDto: PaymentDtoParams,
  ): Promise<StakedContractEntities | undefined> {
    const params = {
      user_id: paymentDto.user_id,
      contract_address: paymentDto.hash,
    };

    const create = this.stakedRepository.create(params);
    try {
      const save = await this.stakedRepository.save(create);
      return save;
    } catch (error) {
      this.logger.error(`payment error => ${error}`);
      return undefined;
    }
  }

  async staked_contract(
    contract: StakedContractInitialize,
  ): Promise<StakedContractEntities | string> {
    let data = await this.fetchByUserAndContract(
      contract.user_id,
      contract.contract_address,
    );

    if (data) {
      data = this.stakedRepository.merge(data, contract);
      return await this.stakedRepository.save(data);
    } else {
      return 'staked.contract_doesnt_exists';
    }
  }

  async fetchByUserAndContract(
    user_id: number,
    contract: string,
  ): Promise<StakedContractEntities | null> {
    try {
      return await this.stakedRepository.findOneBy({
        user_id: user_id,
        contract_address: contract,
      });
    } catch (error) {
      return null;
    }
  }
}
