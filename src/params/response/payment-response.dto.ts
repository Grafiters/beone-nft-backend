import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponse {
  @ApiProperty({ type: String })
  hash: number;
}
