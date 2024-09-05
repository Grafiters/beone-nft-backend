import { UserService } from '@db/models/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtServices } from '@services/jwt/jwt.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtServices,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('jwt token provided');
    }

    try {
      const decode = await this.jwtService.verifySession(token);
      const user = await this.userService.findUserByAddress(decode.sub);
      if (user) {
        request.headers['users'] = JSON.stringify(user);
      } else {
        request.headers['users'] = undefined;
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
