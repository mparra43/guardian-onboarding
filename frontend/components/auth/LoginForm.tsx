'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { loginAction } from '@/app/actions/auth'
import { loginSchema, type LoginFormData } from '@/schemas'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null)

    try {
      const result = await loginAction(data)

      if (result.success && result.user) {
        login(result.user)

        if (!result.user.onboardingCompleted) {
          router.push('/onboarding')
        } else {
          router.push('/products')
        }
      } else {
        setSubmitError(result.error || 'Login failed')
      }
    } catch (error: any) {
      setSubmitError(error.message || 'An unexpected error occurred')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ingresa tus credenciales para acceder
        </p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {submitError && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-lg"
              role="alert"
            >
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          <Input
            {...register('username')}
            type="text"
            label="Nombre de usuario"
            placeholder="admin"
            error={errors.username?.message}
            required
            autoComplete="username"
            disabled={isSubmitting}
          />

          <Input
            {...register('password')}
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            error={errors.password?.message}
            required
            autoComplete="current-password"
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Contacta soporte
            </a>
          </p>
        </div>
      </CardBody>
    </Card>
  )
}
