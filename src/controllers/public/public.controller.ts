import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class PublicController {
  @Get()
  health(): string {
    return 'Health is true';
  }
}
