import { ApiProperty } from '@nestjs/swagger';

export class CollectionBodyRequest {
  @ApiProperty({ type: String, required: true })
  address: string;
}
