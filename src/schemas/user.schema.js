import { z } from 'zod'

const nameCondition = /\[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/

export const userSchema = z.object({
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
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[a-z]/, { message: 'La contraseña debe contener al menos una letra minúscula.' })
        .regex(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula.' })
        .regex(/\d/, { message: 'La contraseña debe contener al menos un número.' })
        .regex(/[\W_]/, { message: 'La contraseña debe contener al menos un carácter especial.' }),
    profile_img: z.string().optional(),
    xp: z.number().optional(),
    level_id: z.string().uuid('Nivel no válido'),
    title: z.string().default('Iniciado'),
    incomes: z.bigint().default(0),
    expenses: z.bigint().default(0),
    balance: z.bigint().default(0)
})