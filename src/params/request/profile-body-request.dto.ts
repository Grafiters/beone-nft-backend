import { ApiProperty } from '@nestjs/swagger';

export class ProfileBodyRequest {
  @ApiProperty({ type: String, required: false })
  username: string;

  @ApiProperty({ type: String, required: false })
  image: string;

  @ApiProperty({ type: String, required: false })
  banner: string;

  @ApiProperty({ type: String, required: false })
  bio: string;

  @ApiProperty({ type: String, required: false })
  discord: string;

  @ApiProperty({ type: String, required: false })
  sosmed_x: string;

  @ApiProperty({ type: String, required: false })
  instagram: string;
}
