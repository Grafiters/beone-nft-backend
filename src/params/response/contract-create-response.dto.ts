import { StakedContractEntities } from '@db/entity/staked_contract.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ContractCreateResponse {
  static async fromContract(contract: StakedContractEntities) {
    const dto = new ContractCreateResponse();
    dto.hash = contract.contract_address;

    return dto;
  }

  @ApiProperty({ type: String })
  hash: string;
}
