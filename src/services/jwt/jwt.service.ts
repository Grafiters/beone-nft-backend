import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class JwtServices {
  private readonly logger = new Logger(JwtServices.name);
  constructor(private jwtService: JwtService) {}

  async sessionCreate(user: any) {
    const privateKey = Buffer.from(
      process.env.JWT_PRIVATE_KEY,
      'base64',
    ).toString('utf-8');
    const jti = await this.generateSecureRandom();
    const payload = {
      sub: user.address,
      iss: 'beonenft',
      aud: ['beonenft'],
      jti: jti,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        algorithm: 'RS256',
        noTimestamp: true,
        privateKey,
      }),
    };
  }

  async verifySession(token: string): Promise<any> {
    const publicKey = Buffer.from(
      process.env.JWT_PUBLIC_KEY,
      'base64',
    ).toString('utf-8');
    try {
      return this.jwtService.verify(token, {
        algorithms: ['RS256'],
        publicKey: publicKey,
      });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async generateSecureRandom(): Promise<string> {
    return randomBytes(10).toString('hex').slice(0, 10);
  }
}
