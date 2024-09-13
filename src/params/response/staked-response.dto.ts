import { StakedContractEntities } from '@db/entity/staked_contract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TokenStakedResponse } from './token-staked-response.dto';

export class StakedResponse {
  static async fromStaked(
    stak: StakedContractEntities,
    reward: TokenStakedResponse | null,
    staked: TokenStakedResponse | null,
  ) {
    const dto = new StakedResponse();
    dto.contract_address = stak.contract_address;
    dto.name = stak.name;
    dto.symbol = stak.symbol;
    dto.hash = stak.hash_initialize;
    dto.staked_token = stak.staked_token;
    dto.reward_token = stak.reward_token;
    dto.reward_per_block = stak.reward_per_block;
    dto.start_block = stak.start_block;
    dto.bonus_end_block = stak.bonus_end_block;
    dto.status = stak.status;
    dto.staked_token_detail = staked;
    dto.reward_token_detail = reward;

    return dto;
  }

  @ApiProperty({ type: String })
  contract_address: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  symbol: string;

  @ApiProperty({ type: String })
  hash: string;

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

  @ApiProperty({ type: TokenStakedResponse })
  staked_token_detail: TokenStakedResponse;

  @ApiProperty({ type: TokenStakedResponse })
  reward_token_detail: TokenStakedResponse;
}
