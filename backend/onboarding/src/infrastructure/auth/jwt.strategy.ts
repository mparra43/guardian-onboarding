import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('jwt.secret') ||
        'guardian-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      this.logger.error('Token inválido: falta sub o email');
      throw new UnauthorizedException('Token inválido');
    }

    if (payload.exp && payload.exp < Date.now() / 1000) {
      this.logger.warn(`Token expirado para usuario: ${payload.sub}`);
      throw new UnauthorizedException('Token expirado');
    }

    this.logger.log(`Autenticación exitosa para usuario: ${payload.sub}`);

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
