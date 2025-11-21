import { Product } from '../entities/product.entity';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findAllPaginated(page: number, limit: number): Promise<{ products: Product[]; total: number }>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
