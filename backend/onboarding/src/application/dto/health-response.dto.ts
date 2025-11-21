import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Estado del servicio',
    example: true,
  })
  ok: boolean;

  constructor(ok: boolean = true) {
    this.ok = ok;
  }
}
