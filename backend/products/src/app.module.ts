import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import { InMemoryProductRepository } from '@infrastructure/adapters/in-memory-product.repository';
import { GetProductsUseCase } from '@application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from '@application/use-cases/get-product-by-id.use-case';
import { ProductsController } from '@presentation/controllers/products.controller';
import { HealthController } from '@presentation/controllers/health.controller';

@Module({
  imports: [],
  controllers: [
    ProductsController,
    HealthController,
  ],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: InMemoryProductRepository,
    },
    GetProductsUseCase,
    GetProductByIdUseCase,
  ],
})
export class AppModule {}
