import { z } from 'zod'

export const levelSchema = z.object({
    level_num: z.number().int().min(1, 'El nivel debe ser un número entero'),
    reward: z.string().min(1, 'La recompensa es obligatoria')
})