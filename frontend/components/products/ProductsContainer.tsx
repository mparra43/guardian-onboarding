'use client'

import { useProducts } from '@/hooks/useProducts'
import { ProductsList } from './ProductsList'
import { Button } from '@/components/ui/Button'

/**
 * ProductsContainer - Componente contenedor con lógica
 * 
 * Maneja el estado, paginación y lógica de negocio
 * Delega la presentación al componente ProductsList
 * Patrón: Container Component
 */
export function ProductsContainer() {
  const {
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
  } = useProducts(1, 6)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          {!isLoading && (
            <p className="text-gray-600 mt-1">
              {total} {total === 1 ? 'product' : 'products'} available
            </p>
          )}
        </div>
      </div>

      {/* Products List */}
      <ProductsList products={products} isLoading={isLoading} error={error} />

      {/* Pagination */}
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
                onClick={() => {}}
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
