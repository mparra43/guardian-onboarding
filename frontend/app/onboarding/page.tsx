'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingForm, OnboardingFormData } from '@/components/onboarding/OnboardingForm'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { submitOnboardingAction } from '@/app/actions/onboarding'
import { useAuth } from '@/contexts/AuthContext'
import { withAuthProtection } from '@/hoc/withAuthProtection'

const STORAGE_KEY = 'onboarding_draft'

function OnboardingPage() {
  const router = useRouter()
  const { updateUser } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [draftData, setDraftData] = useState<Partial<OnboardingFormData>>({
    nombre: '',
    documento: '',
    email: '',
    montoInicial: '',
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setDraftData({
          nombre: parsed.nombre || '',
          documento: parsed.documento || '',
          email: parsed.email || '',
          montoInicial: parsed.montoInicial || '',
        })
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
  }, [])

  const handleSubmit = async (data: OnboardingFormData) => {
    setSubmitError(null)

    try {
      // Convert montoInicial from string to number for API
      const submitData = {
        nombre: data.nombre,
        documento: data.documento,
        email: data.email,
        montoInicial: parseFloat(data.montoInicial),
      }

      const result = await submitOnboardingAction(submitData)

      if (result.success) {
        localStorage.removeItem(STORAGE_KEY)
        updateUser({ onboardingCompleted: true })
        router.push('/products')
      } else {
        setSubmitError(result.error || 'Onboarding submission failed')
      }
    } catch (error: any) {
      setSubmitError(error.message || 'An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-900">Completa tu perfil</h1>
            <p className="mt-2 text-gray-600">
              Proporciona tu información para completar el proceso de onboarding
            </p>
          </CardHeader>

          <CardBody>
            {submitError && (
              <div
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
              >
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            )}

            <OnboardingForm onSubmit={handleSubmit} defaultValues={draftData}>
              <div className="space-y-6">
                <OnboardingForm.Section
                  title="Información Personal"
                  description="Ingresa tus datos personales"
                >
                  <OnboardingForm.Field
                    name="nombre"
                    label="Nombre completo"
                    placeholder="Juan Pérez"
                    helperText="Ingresa tu nombre legal completo"
                  />

                  <OnboardingForm.Field
                    name="documento"
                    label="Número de documento"
                    placeholder="12345678"
                    helperText="Solo números, sin guiones ni espacios"
                  />

                  <OnboardingForm.Field
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    placeholder="tu@email.com"
                    helperText="Usaremos este email para notificaciones"
                  />
                </OnboardingForm.Section>

                <OnboardingForm.Section
                  title="Información Financiera"
                  description="Define tu inversión inicial"
                >
                  <OnboardingForm.Field
                    name="montoInicial"
                    label="Monto inicial"
                    type="number"
                    placeholder="5000"
                    helperText="Monto mínimo: $1,000"
                  />
                </OnboardingForm.Section>

                <div className="pt-4 border-t border-gray-200">
                  <OnboardingForm.SubmitButton>
                    Completar Onboarding
                  </OnboardingForm.SubmitButton>
                </div>
              </div>
            </OnboardingForm>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Tu progreso se guarda automáticamente
              </p>
            </div>
          </CardBody>
        </Card>
        </div>
      </main>
    </div>
  )
}

export default withAuthProtection(OnboardingPage, {
  requireOnboarding: false,
})
