import { CollectionType } from '@db/entity/enum/collection';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, Matches } from 'class-validator';

export class CollectionBodyRequest {
  @ApiProperty({ type: String, required: true })
  @Matches(/^0x[0-9A-Fa-f]+$/, { message: 'Hash must have prefix with 0x' })
  hash: string;

  @ApiProperty({ type: CollectionType, required: true })
  @IsEnum(CollectionType, {
    message: `Collection type must be one of the following values: ${CollectionType}`,
  })
  collection_type: CollectionType;

  @ApiProperty({ type: String, required: true })
  logo_url: string;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true })
  symbol: string;
}
