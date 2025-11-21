'use client'

import React, { createContext, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { onboardingSchema, type OnboardingFormData } from '@/schemas'

export type { OnboardingFormData }

interface OnboardingFormContextValue {
  control: any
  errors: any
  isSubmitting: boolean
}

const OnboardingFormContext = createContext<OnboardingFormContextValue | undefined>(undefined)

function useOnboardingFormContext() {
  const context = useContext(OnboardingFormContext)
  if (!context) {
    throw new Error('OnboardingForm compound components must be used within OnboardingForm')
  }
  return context
}

interface OnboardingFormProps {
  children: React.ReactNode
  onSubmit: (data: OnboardingFormData) => Promise<void>
  defaultValues?: Partial<OnboardingFormData>
}

export function OnboardingForm({ children, onSubmit, defaultValues }: OnboardingFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onBlur',
    defaultValues,
  })

  const contextValue: OnboardingFormContextValue = {
    control,
    errors,
    isSubmitting,
  }

  return (
    <OnboardingFormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {children}
      </form>
    </OnboardingFormContext.Provider>
  )
}

interface FieldProps {
  name: keyof OnboardingFormData
  label: string
  placeholder?: string
  helperText?: string
  type?: 'text' | 'email' | 'number'
}

OnboardingForm.Field = function Field({
  name,
  label,
  placeholder,
  helperText,
  type = 'text',
}: FieldProps) {
  const { control, errors, isSubmitting } = useOnboardingFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          type={type}
          label={label}
          placeholder={placeholder}
          helperText={helperText}
          error={errors[name]?.message as string}
          disabled={isSubmitting}
          required
        />
      )}
    />
  )
}

interface SubmitButtonProps {
  children: React.ReactNode
  className?: string
}

OnboardingForm.SubmitButton = function SubmitButton({
  children,
  className,
}: SubmitButtonProps) {
  const { isSubmitting } = useOnboardingFormContext()

  return (
    <Button
      type="submit"
      variant="primary"
      className={`w-full ${className || ''}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Procesando...
        </>
      ) : (
        children
      )}
    </Button>
  )
}

interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

OnboardingForm.Section = function Section({ title, description, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
