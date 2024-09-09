import { z } from 'zod'

const nameCondition = /[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/

export const createSchema = z.object({
    first_name: z.string()
        .min(1, 'El nombre es obligatorio')
        .regex(nameCondition, 'El nombre solo puede contener letras'),
    last_name: z.string()
        .min(1, 'El apellido es obligatorio')
        .regex(nameCondition, 'El apellido solo puede contener letras'),
    nickname: z
        .string()
        .min(1, 'El nombre de usuario es obligatorio'),
    email: z.string()
        .min(1, 'El correo es obligatorio')
        .email('Formato de correo incorrecto'),
    profile_img: z.string().default('default.png'),
    xp: z.number().default(0),
    title: z.string().default('Iniciado'),
    incomes: z.number().default(0),
    expenses: z.number().default(0),
    balance: z.number().default(0)
})