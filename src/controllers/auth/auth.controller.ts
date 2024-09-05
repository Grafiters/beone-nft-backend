import { Body, Controller, Logger, Post, Request, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@services/auth/auth.service';
import { AuthSessionRequest } from '@params/request/auth-session-body-request.dto';
import { GeneralResponse } from '@params/response/general-response.dto';
import { JwtServices } from '../../services/jwt/jwt.service';
import { FastifyReply } from 'fastify';
import { UserService } from '@db/models/user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
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
    const { address, message, signature, provider, chainId } = body;
    try {
      const isValid = await this.authService.verifySignature(
        address,
        message,
        signature,
      );

      if (isValid) {
        const user = await this.userService.createOrUpdateUser(
          address,
          provider,
          chainId,
        );

        const access_token = await this.jwtServices.sessionCreate({
          address: user.address,
        });

        return res.send({
          status: 200,
          message: access_token.access_token,
        });
      } else {
        return res.status(422).send({
          status: 422,
          message: 'auth.signature_invalid_signer_or_message',
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
