import { z } from 'zod'

export const hobbySchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    hobby_type: z.enum(['actividad', 'objeto'], 'Tipo de hobby inválido')
})