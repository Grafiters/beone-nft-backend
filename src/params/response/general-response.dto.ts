import { ApiProperty } from '@nestjs/swagger';

export class GeneralResponse {
  @ApiProperty({ type: Number })
  status: number;

  @ApiProperty({ type: String })
  message: string;
}
