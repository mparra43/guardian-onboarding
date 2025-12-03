import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BackButton } from '@/components/products/BackButton'
import { getProductByIdAction } from '@/app/actions/products'

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = await getProductByIdAction(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <div className="relative h-96 w-full">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                {product.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    {product.category}
                  </span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {product.stock !== undefined && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">
                    {product.stock > 10 ? 'En stock' : `Solo ${product.stock} disponibles`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-gray-700">Envío gratis en compras mayores a $100</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button variant="primary" className="w-full" size="lg">
                Agregar al carrito
              </Button>
              <Button variant="outline" className="w-full">
                Agregar a favoritos
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
