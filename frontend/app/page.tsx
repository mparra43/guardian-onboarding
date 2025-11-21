import { Navbar } from '@/components/layout/Navbar'
import { ProductsContainer } from '@/components/products/ProductsContainer'

/**
 * Home Page - Página principal de la aplicación
 * 
 * Arquitectura:
 * - Navbar: Componente de navegación sticky en la parte superior
 * - ProductsContainer: Contenedor con lógica de productos y paginación
 * 
 * Patrones implementados:
 * - Server Component (por defecto en Next.js 14+ App Router)
 * - Composition pattern para estructura de layout
 * - Separation of concerns (navegación y contenido separados)
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar sticky en la parte superior */}
      <Navbar />
      
      {/* Contenido principal con listado de productos */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsContainer />
      </main>
    </div>
  )
}
