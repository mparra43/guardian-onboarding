import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { Card, CardBody } from '@/components/ui/Card'

interface ProductsListProps {
  products: Product[]
  isLoading: boolean
  error: string | null
}

export function ProductsList({ products, isLoading, error }: ProductsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200" />
            <CardBody>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </CardBody>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-gray-500 text-sm mt-2">Please try again later</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">No products available</p>
        <p className="text-gray-500 text-sm mt-2">Check back soon for new items</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <Card hover className="h-full">
            {product.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <CardBody className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.category && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    {product.category}
                  </span>
                )}
              </div>
              
              {product.stock !== undefined && product.stock < 20 && (
                <p className="text-orange-600 text-xs mt-2">
                  Only {product.stock} left in stock
                </p>
              )}
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  )
}
