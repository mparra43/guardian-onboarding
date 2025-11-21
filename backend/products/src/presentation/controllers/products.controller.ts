import { Controller, Get, Param, Query, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GetProductsUseCase } from '@application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from '@application/use-cases/get-product-by-id.use-case';
import { ProductResponseDto } from '@application/dto/product-response.dto';
import { PaginationQueryDto } from '@application/dto/pagination-query.dto';
import { PaginatedProductsResponseDto } from '@application/dto/paginated-products-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener productos con paginación',
    description: 'Retorna una lista paginada de productos disponibles',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (comienza en 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de productos obtenida exitosamente',
    type: PaginatedProductsResponseDto,
  })
  async getProducts(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedProductsResponseDto> {
    const { page = 1, limit = 10 } = paginationQuery;
    const { products, total } = await this.getProductsUseCase.execute(page, limit);
    
    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map((product) => product.toJSON() as ProductResponseDto),
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener producto por ID',
    description: 'Retorna un producto específico buscándolo por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto',
    example: '1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto encontrado',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
  })
  async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.getProductByIdUseCase.execute(id);
    return product.toJSON() as ProductResponseDto;
  }
}
