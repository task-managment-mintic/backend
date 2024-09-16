import { z } from 'zod'

export const hobbySchema = z.object({
    name: z.string().min(1, { message: 'El nombre es obligatorio' }),
    hobby_type: z.enum(['actividad', 'objeto'], { message: 'Tipo de hobby inválido' })
})