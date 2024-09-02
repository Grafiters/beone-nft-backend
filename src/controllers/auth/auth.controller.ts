import { Body, Controller, Logger, Post, Request, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@services/auth/auth.service';
import { AuthSessionRequest } from '@params/request/auth-session-body-request.dto';
import { GeneralResponse } from '@params/response/general-response.dto';
import { JwtServices } from '../../services/jwt/jwt.service';
import { FastifyReply } from 'fastify';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private jwtServices: JwtServices,
  ) {}

  @Post()
  @ApiOperation({ summary: 'user auth generate session' })
  @ApiOkResponse({ type: GeneralResponse })
  @ApiBody({ type: AuthSessionRequest })
  async auth(
    @Request() req: any,
    @Body() body: AuthSessionRequest,
    @Res() res: FastifyReply,
  ): Promise<void> {
    const { address, message, signature } = body;
    try {
      const isValid = await this.authService.verifySignature(
        address,
        message,
        signature,
      );

      if (isValid) {
        const access_token = await this.jwtServices.sessionCreate({
          uid: '12345678',
        });

        res.setCookie('_nft_session', access_token.access_token, {
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'strict',
        });

        return res.send({
          status: 200,
          message: 'auth.session_created',
        });
      }
    } catch (error) {
      this.logger.error(error);
      return res.status(422).send({
        status: 422,
        message: 'auth.invalid_body_message',
      });
    }
  }
}
