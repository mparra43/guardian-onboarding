import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Headers,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { CreateOnboardingUseCase } from '@application/use-cases/create-onboarding.use-case';
import { CreateOnboardingDto } from '@application/dto/create-onboarding.dto';
import { OnboardingResponseDto } from '@application/dto/onboarding-response.dto';
import { HealthResponseDto } from '@application/dto/health-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Onboarding')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('onboarding')
@UseInterceptors(ClassSerializerInterceptor)
export class OnboardingController {
  private readonly logger = new Logger(OnboardingController.name);

  constructor(
    private readonly createOnboardingUseCase: CreateOnboardingUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nuevo onboarding',
    description:
      'Endpoint protegido que requiere token JWT válido. Crea un nuevo proceso de onboarding con estado inicial REQUESTED.',
  })
  @ApiHeader({
    name: 'Content-Type',
    description: 'Debe ser application/json',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Onboarding creado exitosamente',
    type: OnboardingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado: Token inválido o expirado',
  })
  @ApiResponse({
    status: 403,
    description: 'Prohibido: Token manipulado',
  })
  async createOnboarding(
    @Body() createOnboardingDto: CreateOnboardingDto,
    @Headers('content-type') contentType: string,
  ): Promise<OnboardingResponseDto> {
    if (!contentType || !contentType.includes('application/json')) {
      this.logger.warn(
        `Intento de acceso con Content-Type inválido: ${contentType}`,
      );
      throw new BadRequestException(
        'Content-Type debe ser application/json',
      );
    }

    this.logger.log(
      `Creando onboarding para: ${createOnboardingDto.email}`,
    );

    const result =
      await this.createOnboardingUseCase.execute(createOnboardingDto);

    this.logger.log(`Onboarding creado exitosamente: ${result.onboardingId}`);

    return result;
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Health check',
    description: 'Verifica el estado del servicio',
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio funcionando correctamente',
    type: HealthResponseDto,
  })
  health(): HealthResponseDto {
    return new HealthResponseDto(true);
  }
}
