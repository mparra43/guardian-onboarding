import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginDto } from '../../application/dto/login.dto';
import { LoginResponseDto } from '../../application/dto/login-response.dto';
import { RefreshTokenDto } from '../../application/dto/refresh-token.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  /**
   * @returns Estado de salud
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check del microservicio' })
  @ApiResponse({ status: 200, description: 'Microservicio operativo', schema: { example: { ok: true } } })
  health(): { ok: boolean } {
    return { ok: true };
  }

  /**
   * @param loginDto 
   * @returns Token JWT
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Autenticación de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute(loginDto);
  }

  /**
   * @param refreshTokenDto
   * @returns Nuevos tokens JWT
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Refrescar token de acceso' })
  @ApiResponse({ status: 200, description: 'Token refrescado exitosamente', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiUnauthorizedResponse({ description: 'Refresh token inválido o expirado' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto> {
    return await this.refreshTokenUseCase.execute(refreshTokenDto);
  }
}
