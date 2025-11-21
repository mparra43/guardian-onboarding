import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario es muy largo'),
  password: z
    .string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .max(100, 'La contraseña es muy larga'),
})

export type LoginFormData = z.infer<typeof loginSchema>
