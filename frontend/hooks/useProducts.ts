'use client'

import { useState, useEffect } from 'react'
import { Product, ProductsResponse } from '@/types'

/**
 * Mock data para demostración
 * En producción, esto vendría de una API real
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
]

/**
 * Custom hook para manejar productos
 * Implementa paginación y manejo de estado
 * 
 * @param initialPage - Página inicial (default: 1)
 * @param pageSize - Cantidad de items por página (default: 6)
 */
export function useProducts(initialPage: number = 1, pageSize: number = 6) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500))

        // Calcular paginación
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedProducts = MOCK_PRODUCTS.slice(startIndex, endIndex)

        setProducts(paginatedProducts)
        setTotal(MOCK_PRODUCTS.length)
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, pageSize])

  const totalPages = Math.ceil(total / pageSize)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return {
    products,
    isLoading,
    error,
    currentPage,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    goToPage,
  }
}
