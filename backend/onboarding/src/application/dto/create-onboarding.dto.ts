import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateOnboardingDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @ApiProperty({
    description: 'Documento de identidad del usuario',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty({ message: 'El documento es requerido' })
  documento: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    description: 'Monto inicial para la cuenta',
    example: 1000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'El monto inicial debe ser un número' })
  @IsNotEmpty({ message: 'El monto inicial es requerido' })
  @Min(0, { message: 'El monto inicial debe ser mayor o igual a 0' })
  montoInicial: number;
}
