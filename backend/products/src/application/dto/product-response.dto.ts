import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Gaming',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Laptop de alto rendimiento para gaming',
  })
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 1299.99,
  })
  price: number;

  @ApiProperty({
    description: 'Categoría del producto',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/images/laptop-gaming.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 10,
  })
  stock: number;
}
