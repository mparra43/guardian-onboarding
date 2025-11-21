import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

export class PaginatedProductsResponseDto {
  @ApiProperty({
    description: 'Lista de productos en la página actual',
    type: [ProductResponseDto],
  })
  data: ProductResponseDto[];

  @ApiProperty({
    description: 'Metadata de paginación',
    example: {
      page: 1,
      limit: 10,
      total: 50,
      totalPages: 5,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
