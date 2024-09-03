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
  constructor(private readonly jwtService: JwtServices) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('jwt token provided');
    }

    try {
      const decode = await this.jwtService.verifySession(token);
      request.headers['users'] = decode.sub;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
