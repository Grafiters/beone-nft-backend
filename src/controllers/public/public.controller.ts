import { ConfigServices } from '@db/models/config/config.service';
import { Controller, Get, Logger } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigResponse } from '@params/response/config-response.dto';
import { BlockchainService } from '@services/blockchain/blockchain.service';
import { plainToInstance } from 'class-transformer';

@ApiTags('public')
@Controller('public')
export class PublicController {
  private readonly logger = new Logger(PublicController.name);
  constructor(
    private readonly configServices: ConfigServices,
    private readonly blockchainService: BlockchainService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'publich check healthty' })
  @ApiResponse({ status: 200, example: 'Health is true' })
  health(): string {
    return 'Health is true';
  }

  @Get('config')
  @ApiOperation({ summary: 'public get config' })
  @ApiOkResponse({ type: ConfigResponse })
  async config(): Promise<ConfigResponse[]> {
    const configs = await this.configServices.fetchConfig();

    const configDto = await Promise.all(
      configs.map((conf) => ConfigResponse.fromConfig(conf)),
    );

    const dto = plainToInstance(ConfigResponse, configDto);
    return dto;
  }

  @Get('lastsBlock')
  @ApiOperation({ summary: 'public get latest block number' })
  @ApiOkResponse({ type: Number })
  async block(): Promise<number> {
    return await this.blockchainService.getCurrentBlock();
  }
}
