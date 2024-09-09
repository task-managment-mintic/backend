import { z } from 'zod'

export const validateSchema = schema => {
    return (req, res, next) => {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            return res.status(400).json({
                message: 'Error en la validación',
                errors: error.errors
            })
        }
    }
}