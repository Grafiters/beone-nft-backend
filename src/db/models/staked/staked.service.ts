import { StakedContractEntities } from '@db/entity/staked_contract.entity';
import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import {
  StakedContractCreate,
  StakedContractInitialize,
} from '@params/function/staked-contract';
import { applyDynamicFilters } from '@tools/query-builder';
import { BlockchainService } from '@services/blockchain/blockchain.service';

@Injectable()
export class StakedService {
  private readonly logger = new Logger(StakedService.name);

  constructor(
    @InjectRepository(StakedContractEntities)
    private readonly stakedRepository: Repository<StakedContractEntities>,
    private readonly blockchainService: BlockchainService,
    private readonly userService: UserService,
  ) {}

  async fetchAll(
    filters:
      | {
          [key: string]: any;
        }
      | '',
  ): Promise<StakedContractEntities[] | []> {
    const staked_data =
      this.stakedRepository.createQueryBuilder('staked_contracts');

    if (filters != '') {
      applyDynamicFilters(staked_data, filters, 'staked_contracts');
    }

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

  async initialize_contract(
    contract: StakedContractInitialize,
    manager?: EntityManager,
  ): Promise<StakedContractEntities | undefined> {
    const stakedContractRepo = manager
      ? manager.getRepository(StakedContractEntities)
      : this.stakedRepository;
    let data: StakedContractEntities = await this.fetchByUserAndContract(
      contract.user_id,
      contract.contract_address,
    );

    try {
      if (data) {
        data = stakedContractRepo.merge(data, {
          staked_token: contract.staked_token,
          reward_token: contract.reward_token,
          reward_per_block: contract.reward_per_block,
          start_block: contract.start_block,
          bonus_end_block: contract.bonus_end_block,
          status: contract.status,
        });

        return await stakedContractRepo.save(data);
      } else {
        return undefined;
      }
    } catch (error) {
      this.logger.error(`errored update initialize staked =>> ${error}`);
      return undefined;
    }
  }

  async init_staked_contract(
    contract: StakedContractCreate,
  ): Promise<StakedContractEntities | string> {
    const data = await this.fetchByUserAndContract(
      contract.user_id,
      contract.contract_address,
    );

    if (data) {
      return 'staked.already_exists';
    }

    try {
      const create = this.stakedRepository.create(contract);
      return await this.stakedRepository.save(create);
    } catch (error) {
      this.logger.error(`errored when init staked to database => ${error}`);
      return 'staked.cannot_create_staked';
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
