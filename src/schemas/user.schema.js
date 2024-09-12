import { z } from 'zod'

const nameCondition = /[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/
const emailCondition = /\S+@\S+\.\S+/

export const createSchema = z.object({
    first_name: z.string().superRefine((val, ctx) => {
        if (!val) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'El nombre es obligatorio'
            })
        } else if (!nameCondition.test(val)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'El nombre solo puede contener letras'
            })
        }
    }),
    last_name: z.string().superRefine((val, ctx) => {
        if (!val) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'El apellido es obligatorio'
            })
        } else if (!nameCondition.test(val)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'El apellido solo puede contener letras'
            })
        }
    }),
    nickname: z
        .string()
        .min(1, 'El nombre de usuario es obligatorio'),
    email: z.string().superRefine((val, ctx) => {
        if (!val) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'El correo electrónico es obligatorio'
            })
        } else if (!emailCondition.test(val)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Formato de correo incorrecto'
            })
        }
    }),
    profile_img: z.string().default('default.png'),
    xp: z.number().default(0),
    title: z.string().default('Iniciado'),
    incomes: z.number().default(0),
    expenses: z.number().default(0),
    balance: z.number().default(0)
})

export const updateSchema = z.object({
    first_name: z.string()
        .regex(nameCondition, 'El nombre solo puede contener letras')
        .optional(),
    last_name: z.string()
        .regex(nameCondition, 'El apellido solo puede contener letras')
        .optional(),
    nickname: z.string().optional(),
    email: z.string()
        .email('Formato de correo incorrecto')
        .optional()
})