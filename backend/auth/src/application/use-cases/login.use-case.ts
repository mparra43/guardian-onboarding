import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Ejecuta el caso de uso de login
   * @param loginDto - Datos de login
   * @returns Token JWT
   */
  async execute(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Buscar usuario por username
    const user = await this.userRepository.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT con payload
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    // Generar refresh token usando jsonwebtoken directamente
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret');
    if (!refreshSecret) {
      throw new UnauthorizedException('Configuración de refresh token no disponible');
    }
    const refreshTokenExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn') || '7d';
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: refreshTokenExpiresIn as string,
    } as SignOptions);

    // Retornar respuesta con ambos tokens (5 minutos = 300 segundos)
    return new LoginResponseDto(accessToken, 300, refreshToken);
  }
}
