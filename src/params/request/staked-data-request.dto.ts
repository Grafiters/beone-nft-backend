import { ApiProperty } from '@nestjs/swagger';

export class PaymentRequest {
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
  bonus_block_end: number;

  @ApiProperty({ type: String })
  status: string;
}
