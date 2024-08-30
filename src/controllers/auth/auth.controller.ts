import { Body, Controller, Logger, Post, Request } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@services/auth/auth.service';
import { AuthSessionRequest } from '@params/request/auth-session-body-request.dto';
import { GeneralResponse } from '@params/response/general-response.dto';
import { plainToInstance } from '@tools/clas-transform';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('auth')
  @ApiOperation({ summary: 'user auth generate session' })
  @ApiOkResponse({ type: GeneralResponse })
  @ApiBody({ type: AuthSessionRequest })
  async auth(
    @Request() req: any,
    @Body() body: AuthSessionRequest,
  ): Promise<GeneralResponse> {
    const { address, message, signature } = body;
    try {
      const isValid = await this.authService.verifySignature(
        address,
        message,
        signature,
      );

      console.log(isValid);
      if (isValid) {
        return plainToInstance(GeneralResponse, {
          status: 200,
          message: 'auth.session_created',
        });
      }
    } catch (error) {
      this.logger.error(error);
      return plainToInstance(GeneralResponse, {
        status: 422,
        message: 'auth.invalid_body_message',
      });
    }
  }
}
