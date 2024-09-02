import {
  Controller,
  Get,
  Logger,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@services/auth/auth.guard';
import { FastifyReply, FastifyRequest } from 'fastify';

@ApiTags('User')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'user get profile' })
  async profile(
    @Request() req: FastifyRequest,
    @Res() res: FastifyReply,
  ): Promise<void> {
    return res.send(req.headers['users']);
  }
}
