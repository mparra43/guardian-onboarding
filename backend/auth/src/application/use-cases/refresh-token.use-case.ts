import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Ejecuta el caso de uso de refresh token
   * @param refreshTokenDto - Datos con el refresh token
   * @returns Nuevos tokens JWT
   */
  async execute(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    try {
      // Verificar el refresh token
      const refreshSecret = this.configService.get<string>('jwt.refreshSecret');
      if (!refreshSecret) {
        throw new UnauthorizedException('Configuración de refresh token no disponible');
      }

      const decoded = jwt.verify(refreshTokenDto.refresh_token, refreshSecret);
      const payload = decoded as any;

      // Crear nuevo access token con el mismo payload (sin exp, iat)
      const newPayload = {
        sub: payload.sub,
        username: payload.username,
        email: payload.email,
      };

      const accessToken = this.jwtService.sign(newPayload);

      // Crear nuevo refresh token usando jsonwebtoken directamente
      const refreshTokenExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn') || '7d';
      if (!refreshSecret) {
        throw new UnauthorizedException('Configuración de refresh token no disponible');
      }
      const refreshToken = jwt.sign(newPayload, refreshSecret, {
        expiresIn: refreshTokenExpiresIn as string,
      } as SignOptions);

      // Retornar respuesta con los nuevos tokens
      return new LoginResponseDto(accessToken, 300, refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
