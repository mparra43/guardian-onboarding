import { Product } from '@domain/entities/product.entity';

describe('Product Entity', () => {
  describe('Validation', () => {
    it('should create a valid product', () => {
      const product = new Product(
        '1',
        'Test Product',
        'Test Description',
        99.99,
        'Test Category',
        'https://example.com/image.jpg',
        10,
      );

      expect(product).toBeDefined();
      expect(product.id).toBe('1');
      expect(product.name).toBe('Test Product');
      expect(product.price).toBe(99.99);
      expect(product.category).toBe('Test Category');
      expect(product.imageUrl).toBe('https://example.com/image.jpg');
      expect(product.stock).toBe(10);
    });

    it('should throw error when id is empty', () => {
      expect(() => {
        new Product('', 'Test Product', 'Description', 99.99, 'Test', 'https://example.com/image.jpg', 10);
      }).toThrow('Product ID is required');
    });

    it('should throw error when name is empty', () => {
      expect(() => {
        new Product('1', '', 'Description', 99.99, 'Test', 'https://example.com/image.jpg', 10);
      }).toThrow('Product name is required');
    });

    it('should throw error when price is negative', () => {
      expect(() => {
        new Product('1', 'Test', 'Description', -10, 'Test', 'https://example.com/image.jpg', 10);
      }).toThrow('Product price cannot be negative');
    });

    it('should throw error when stock is negative', () => {
      expect(() => {
        new Product('1', 'Test', 'Description', 99.99, 'Test', 'https://example.com/image.jpg', -5);
      }).toThrow('Product stock cannot be negative');
    });
  });

  describe('Business Logic', () => {
    it('should return true when product is available', () => {
      const product = new Product(
        '1',
        'Test Product',
        'Description',
        99.99,
        'Test',
        'https://example.com/image.jpg',
        10,
      );

      expect(product.isAvailable()).toBe(true);
    });

    it('should return false when product is not available', () => {
      const product = new Product(
        '1',
        'Test Product',
        'Description',
        99.99,
        'Test',
        'https://example.com/image.jpg',
        0,
      );

      expect(product.isAvailable()).toBe(false);
    });

    it('should convert to JSON correctly', () => {
      const product = new Product(
        '1',
        'Test Product',
        'Description',
        99.99,
        'Test',
        'https://example.com/image.jpg',
        10,
      );

      const json = product.toJSON();

      expect(json.id).toBe('1');
      expect(json.name).toBe('Test Product');
      expect(json.description).toBe('Description');
      expect(json.price).toBe(99.99);
      expect(json.category).toBe('Test');
      expect(json.imageUrl).toBe('https://example.com/image.jpg');
      expect(json.stock).toBe(10);
    });
  });
});
