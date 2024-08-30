import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('public')
@Controller('public')
export class PublicController {
  @Get()
  @ApiOperation({ summary: 'publich check healthty' })
  @ApiResponse({ status: 200, example: 'Health is true' })
  health(): string {
    return 'Health is true';
  }
}
