import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'typeorm';

export class ProfileResponse {
  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  image: string;

  @ApiProperty({ type: String })
  banner: string;

  @ApiProperty({ type: String })
  bio: string;

  @ApiProperty({ type: String })
  discord: string;

  @ApiProperty({ name: 'sosmed_x', type: String })
  sosmedX: string;

  @ApiProperty({ type: String })
  instagram: string;

  @ApiProperty({ type: Timestamp })
  created_at: string;

  @ApiProperty({ type: Timestamp })
  updated_at: string;
}
