import { ApiProperty } from '@nestjs/swagger';

export class GeneralResponse {
  @ApiProperty({ type: String })
  uid: string;

  @ApiProperty({ type: String })
  message: string;
}
