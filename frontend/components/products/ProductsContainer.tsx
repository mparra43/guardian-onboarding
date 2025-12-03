'use client'

import { useState, useTransition } from 'react'
import { ProductsList } from './ProductsList'
import { Button } from '@/components/ui/Button'
import { ProductsResponse } from '@/types'

interface ProductsContainerProps {
  initialData: ProductsResponse | null
}

export function ProductsContainer({ initialData }: ProductsContainerProps) {
  const [data, setData] = useState<ProductsResponse | null>(initialData)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const products = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / 6)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const fetchProducts = async (page: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products?page=${page}&limit=6`)
      
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }

      const responseData: ProductsResponse = await response.json()
      
      startTransition(() => {
        setData(responseData)
        setCurrentPage(page)
      })
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos')
    } finally {
      setIsLoading(false)
    }
  }

  const goToNextPage = () => {
    if (hasNextPage && !isLoading) {
      fetchProducts(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (hasPrevPage && !isLoading) {
      fetchProducts(currentPage - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && !isLoading) {
      fetchProducts(page)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          {!isLoading && data && (
            <p className="text-gray-600 mt-1">
              {total} {total === 1 ? 'product' : 'products'} available
            </p>
          )}
        </div>
      </div>

      <ProductsList products={products} isLoading={isLoading || isPending} error={error} />

      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            variant="outline"
            size="sm"
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <Button
            onClick={goToNextPage}
            disabled={!hasNextPage}
            variant="outline"
            size="sm"
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  )
}
