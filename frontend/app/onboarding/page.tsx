import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

/**
 * Onboarding Page - Página de registro/onboarding
 * 
 * Esta es una página placeholder que deberá ser implementada
 * con el formulario de onboarding completo según los requerimientos
 */
export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">Completa tu perfil</h1>
            <p className="mt-2 text-gray-600">
              Proporciona tu información para completar el proceso de registro
            </p>
          </CardHeader>

          <CardBody>
            <form className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de documento
                  </label>
                  <input
                    type="text"
                    id="documento"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12345678"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información Financiera</h3>
                
                <div>
                  <label htmlFor="montoInicial" className="block text-sm font-medium text-gray-700 mb-1">
                    Monto inicial
                  </label>
                  <input
                    type="number"
                    id="montoInicial"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mínimo: $1,000</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button type="submit" variant="primary" className="w-full">
                  Completar Onboarding
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
