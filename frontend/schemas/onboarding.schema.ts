import { z } from 'zod'

export const onboardingSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no debe exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  documento: z
    .string()
    .min(1, 'El documento es requerido')
    .regex(/^\d+$/, 'El documento debe contener solo números'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Por favor ingresa un email válido'),
  montoInicial: z
    .string()
    .min(1, 'El monto inicial es requerido')
    .refine(
      (val) => {
        const num = parseFloat(val)
        return !isNaN(num) && num >= 1000
      },
      { message: 'El monto inicial debe ser al menos $1,000' }
    ),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
