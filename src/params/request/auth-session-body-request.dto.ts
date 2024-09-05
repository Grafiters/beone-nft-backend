import { ApiProperty } from '@nestjs/swagger';

export class AuthSessionRequest {
  @ApiProperty({ type: String, required: true })
  address: string;

  @ApiProperty({ type: String, required: true })
  message: string;

  @ApiProperty({ type: String, required: true })
  signature: string;

  @ApiProperty({ name: 'provider', type: String, required: true })
  provider: string;

  @ApiProperty({ name: 'chain_id', type: Number, required: true })
  chainId: number;
}
