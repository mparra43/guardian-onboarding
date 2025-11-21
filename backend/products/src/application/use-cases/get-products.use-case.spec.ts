import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsUseCase } from '@application/use-cases/get-products.use-case';
import { PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import type { IProductRepository } from '@domain/repositories/product.repository.interface';
import { Product } from '@domain/entities/product.entity';

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;
  let mockRepository: IProductRepository;

  beforeEach(async () => {
    const mockProducts = [
      new Product('1', 'Test Product 1', 'Description 1', 99.99, 'Test', 'https://example.com/1.jpg', 10),
      new Product('2', 'Test Product 2', 'Description 2', 199.99, 'Test', 'https://example.com/2.jpg', 5),
    ];

    mockRepository = {
      findAll: jest.fn().mockResolvedValue(mockProducts),
      findAllPaginated: jest.fn().mockResolvedValue({
        products: mockProducts,
        total: 2,
      }),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductsUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProductsUseCase>(GetProductsUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return paginated products', async () => {
    const result = await useCase.execute(1, 10);

    expect(result.products).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.products[0].name).toBe('Test Product 1');
    expect(result.products[1].name).toBe('Test Product 2');
    expect(mockRepository.findAllPaginated).toHaveBeenCalledWith(1, 10);
  });

  it('should return empty array when no products exist', async () => {
    jest.spyOn(mockRepository, 'findAllPaginated').mockResolvedValue({
      products: [],
      total: 0,
    });

    const result = await useCase.execute(1, 10);

    expect(result.products).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(mockRepository.findAllPaginated).toHaveBeenCalledWith(1, 10);
  });

  it('should use default values when not provided', async () => {
    await useCase.execute();

    expect(mockRepository.findAllPaginated).toHaveBeenCalledWith(1, 10);
  });
});
