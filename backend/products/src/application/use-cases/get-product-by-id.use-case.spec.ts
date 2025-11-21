import { Test, TestingModule } from '@nestjs/testing';
import { GetProductByIdUseCase } from '@application/use-cases/get-product-by-id.use-case';
import { PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import type { IProductRepository } from '@domain/repositories/product.repository.interface';
import { Product } from '@domain/entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
  let mockRepository: IProductRepository;

  beforeEach(async () => {
    const testProduct = new Product(
      '1',
      'Test Product',
      'Test Description',
      99.99,
      'Test',
      'https://example.com/image.jpg',
      10,
    );

    mockRepository = {
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn().mockResolvedValue(testProduct),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProductByIdUseCase,
        {
          provide: PRODUCT_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProductByIdUseCase>(GetProductByIdUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return a product when found', async () => {
    const result = await useCase.execute('1');

    expect(result).toBeDefined();
    expect(result.id).toBe('1');
    expect(result.name).toBe('Test Product');
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException when product does not exist', async () => {
    jest.spyOn(mockRepository, 'findById').mockResolvedValue(null);

    await expect(useCase.execute('999')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('999')).rejects.toThrow(
      'Product with ID 999 not found',
    );
  });
});
