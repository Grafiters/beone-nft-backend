import { ApiProperty } from '@nestjs/swagger';

export class StakedRequest {
  @ApiProperty({ type: String, required: true })
  contract_address: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  symbol: string;

  @ApiProperty({ type: String, required: true })
  staked_token: string;

  @ApiProperty({ type: String, required: true })
  reward_token: string;

  @ApiProperty({ type: String, required: true })
  reward_per_block: string;

  @ApiProperty({ type: Number, required: true })
  start_block: number;

  @ApiProperty({ type: Number, required: true })
  bonus_block_end: number;
}
