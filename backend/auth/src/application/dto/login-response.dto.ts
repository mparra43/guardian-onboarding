import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT de acceso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Tiempo de expiración del token en segundos',
    example: 300,
  })
  expires_in: number;

  constructor(accessToken: string, expiresIn: number = 300) {
    this.access_token = accessToken;
    this.token_type = 'Bearer';
    this.expires_in = expiresIn;
  }
}
