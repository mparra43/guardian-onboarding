'use server'

import { createProductsClient } from '@/lib/axios-clients'
import { ProductsResponse, Product } from '@/types'

export async function getProductsAction(page: number = 1, limit: number = 6): Promise<ProductsResponse | null> {
  try {
    const productsClient = createProductsClient()
    const response = await productsClient.get<ProductsResponse>('/products', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return null
  }
}

export async function getProductByIdAction(productId: string): Promise<Product | null> {
  try {
    const productsClient = createProductsClient()
    const response = await productsClient.get<Product>(`/products/${productId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error)
    return null
  }
}
