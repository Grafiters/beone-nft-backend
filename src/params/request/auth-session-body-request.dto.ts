import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class AuthSessionRequest {
  @ApiProperty({ type: String, required: true })
  @Matches(/^0x[0-9A-Fa-f]+$/, { message: 'Hash must have prefix with 0x' })
  address: string;

  @ApiProperty({ type: String, required: true })
  message: string;

  @ApiProperty({ type: String, required: true })
  @Matches(/^0x[0-9A-Fa-f]+$/, { message: 'Hash must have prefix with 0x' })
  signature: string;

  @ApiProperty({ name: 'provider', type: String, required: false })
  provider: string;

  @ApiProperty({ name: 'chain_id', type: Number, required: true })
  chainId: number;
}
