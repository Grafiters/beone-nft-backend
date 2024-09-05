import { ApiProperty } from '@nestjs/swagger';

export class PaymentRequest {
  @ApiProperty({ type: String, required: true })
  hash: string;
}
