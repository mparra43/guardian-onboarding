import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '@domain/repositories/product.repository.interface';
import { PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import { Product } from '@domain/entities/product.entity';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ products: Product[]; total: number }> {
    return await this.productRepository.findAllPaginated(page, limit);
  }
}
