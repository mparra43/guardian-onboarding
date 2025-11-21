import { Injectable } from '@nestjs/common';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { Product } from '@domain/entities/product.entity';

@Injectable()
export class InMemoryProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData(): void {
    const sampleProducts = [
      new Product(
        '1',
        'Laptop Gaming',
        'Laptop de alto rendimiento con RTX 4070, 32GB RAM',
        1299.99,
        'Electronics',
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
        10,
      ),
      new Product(
        '2',
        'Mouse Inalámbrico',
        'Mouse ergonómico con sensor de precisión',
        49.99,
        'Accessories',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        50,
      ),
      new Product(
        '3',
        'Teclado Mecánico',
        'Teclado mecánico RGB con switches Cherry MX',
        129.99,
        'Accessories',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        30,
      ),
      new Product(
        '4',
        'Monitor 4K',
        'Monitor 27 pulgadas 4K UHD con HDR',
        499.99,
        'Electronics',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        15,
      ),
      new Product(
        '5',
        'Auriculares Gaming',
        'Auriculares con sonido surround 7.1',
        89.99,
        'Accessories',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
        25,
      ),
      new Product(
        '6',
        'Webcam HD',
        'Webcam 1080p con micrófono integrado',
        69.99,
        'Accessories',
        'https://images.unsplash.com/photo-1625890656577-1753bb3b32f5?w=400',
        0,
      ),
      new Product(
        '7',
        'SSD 1TB',
        'Disco de estado sólido NVMe de alta velocidad',
        149.99,
        'Storage',
        'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
        40,
      ),
      new Product(
        '8',
        'Tarjeta Gráfica',
        'GPU RTX 4080 16GB',
        1199.99,
        'Components',
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
        5,
      ),
    ];

    sampleProducts.forEach((product) => {
      this.products.set(product.id, product);
    });
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }> {
    const allProducts = Array.from(this.products.values());
    const total = allProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = allProducts.slice(startIndex, endIndex);

    return { products, total };
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async save(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }
}
