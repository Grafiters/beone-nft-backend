import { ApiProperty } from '@nestjs/swagger';
import { TokenStaked } from '@params/function/staked-contract';

export class TokenStakedResponse {
  static async fromStaked(stak: TokenStaked | null) {
    const dto = new TokenStakedResponse();
    dto.decimals = stak.decimals;
    dto.name = stak.name;
    dto.symbol = stak.symbol;
    dto.address = stak.address;
    dto.chainId = stak.chainId;
    dto.projectLink = stak.projectLink;

    return dto;
  }

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: Number })
  chainId: number;

  @ApiProperty({ type: String })
  decimals: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  symbol: string;

  @ApiProperty({ type: String })
  projectLink: string;
}
