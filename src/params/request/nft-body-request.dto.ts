import { CollectionType } from '@db/entity/enum/collection';
import { ApiProperty } from '@nestjs/swagger';
import { IsJsonConstraint } from '@tools/json-validator';
import { IsNumberConstraint } from '@tools/number-validation';
import { IsEnum, Matches, Validate } from 'class-validator';

export class NftTokenBodyRequest {
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

  @ApiProperty({ type: String, required: false })
  @Validate(IsJsonConstraint, { message: `The data must be json stringify` })
  properties: string;

  @ApiProperty({ type: String, required: false })
  @Validate(IsJsonConstraint, { message: `The data must be json stringify` })
  tag: string;

  @ApiProperty({ type: String, required: false })
  @Validate(IsJsonConstraint, { message: `The data must be json stringify` })
  statistic: string;

  @ApiProperty({ type: Number, required: true, default: 1 })
  @Validate(IsNumberConstraint, { message: 'Supply mus be type data number' })
  supply: number;
}
