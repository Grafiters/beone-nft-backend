import { ApiProperty } from '@nestjs/swagger';

export class AuthSessionRequest {
  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  signature: string;
}
