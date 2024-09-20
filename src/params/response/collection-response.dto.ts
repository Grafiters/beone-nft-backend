import { CollectionType } from '@db/entity/enum/collection';
import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'typeorm';

export class ProfileResponse {
  @ApiProperty({ type: String })
  uid: string;

  @ApiProperty({ name: 'contract_address', type: String })
  contractAddress: string;

  @ApiProperty({ name: 'hash', type: String })
  hash: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  symbol: string;

  @ApiProperty({ type: String })
  logo_url: string;

  @ApiProperty({ type: CollectionType })
  mint_type: string;

  @ApiProperty({ type: Timestamp })
  created_at: string;

  @ApiProperty({ type: Timestamp })
  updated_at: string;
}
