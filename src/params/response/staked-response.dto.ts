import { StakedContractEntities } from '@db/entity/staked_contract.entity';
import { ApiProperty } from '@nestjs/swagger';

export class StakedResponse {
  static async fromStaked(stak: StakedContractEntities) {
    const dto = new StakedResponse();
    dto.contract_address = stak.contract_address;
    dto.name = stak.name;
    dto.symbol = stak.symbol;
    dto.staked_token = stak.staked_token;
    dto.reward_token = stak.reward_token;
    dto.reward_per_block = stak.reward_per_block;
    dto.start_block = stak.start_block;
    dto.bonus_end_block = stak.bonus_end_block;
    dto.status = stak.status;

    return dto;
  }

  @ApiProperty({ type: String })
  contract_address: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  symbol: string;

  @ApiProperty({ type: String })
  staked_token: string;

  @ApiProperty({ type: String })
  reward_token: string;

  @ApiProperty({ type: String })
  reward_per_block: string;

  @ApiProperty({ type: Number })
  start_block: number;

  @ApiProperty({ type: Number })
  bonus_end_block: number;

  @ApiProperty({ type: String })
  status: string;
}
