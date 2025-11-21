import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

export class HealthResponseDto {
  ok: boolean;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description:
      'Verifica que el microservicio está funcionando correctamente',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El servicio está funcionando correctamente',
    type: HealthResponseDto,
  })
  getHealth(): HealthResponseDto {
    return { ok: true };
  }
}
