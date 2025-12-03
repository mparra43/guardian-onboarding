'use server'

import { createProductsClient } from '@/lib/axios-clients'
import { Product, ProductsResponse } from '@/types'

/**
 * Mock products data
 * This simulates PRODUCTS_SERVICE response
 */
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Laptop',
    description: 'High-performance laptop with latest processor and graphics card',
    price: 1299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    stock: 15,
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling bluetooth headphones with premium sound quality',
    price: 299.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 30,
  },
  {
    id: '3',
    name: 'Smart Watch',
    description: 'Advanced fitness tracking and notifications on your wrist',
    price: 399.99,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 25,
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with customizable keys',
    price: 149.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    stock: 40,
  },
  {
    id: '5',
    name: '4K Monitor',
    description: 'Ultra HD display with vibrant colors and high refresh rate',
    price: 549.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    stock: 12,
  },
  {
    id: '6',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 79.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    stock: 50,
  },
  {
    id: '7',
    name: 'Portable SSD',
    description: '1TB external storage with fast read/write speeds',
    price: 159.99,
    category: 'Storage',
    imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
    stock: 35,
  },
  {
    id: '8',
    name: 'USB-C Hub',
    description: 'Multi-port adapter for all your connectivity needs',
    price: 49.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
    stock: 60,
  },
  {
    id: '9',
    name: 'Webcam HD',
    description: 'High-definition webcam for video calls and streaming',
    price: 89.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
    stock: 20,
  },
  {
    id: '10',
    name: 'Gaming Chair',
    description: 'Ergonomic gaming chair with lumbar support',
    price: 349.99,
    category: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400',
    stock: 18,
  },
  {
    id: '11',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 59.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    stock: 45,
  },
  {
    id: '12',
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with 360-degree sound',
    price: 129.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 32,
  },
]

/**
 * Server Action: Get products with pagination
 * 
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 */
export async function getProductsAction(page: number = 1, limit: number = 6) {
  try {
    const productsClient = createProductsClient()
    
    const response = await productsClient.get<ProductsResponse>('/products', {
      params: { page, limit }
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error('Get products error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch products',
    }
  }
}

/**
 * Server Action: Get single product by ID
 * 
 * @param id - Product ID
 */
export async function getProductByIdAction(id: string) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const product = MOCK_PRODUCTS.find(p => p.id === id)

    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      }
    }

    return { success: true, data: product }
  } catch (error: any) {
    console.error('Get product error:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch product',
    }
  }
}
