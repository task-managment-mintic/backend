import bcrypt from 'bcryptjs'
import { User } from '../models/user.model.js'

export const createAccount = async (req, res) => {
    const {
        first_name,
        last_name,
        nickname,
        email,
        password
    } = req.body
    const errors = []

    try {
        if (password.length < 8 || password.length > 20) {
            errors.push('La contraseña debe tener entre 8 y 20 caracteres')
        }

        const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/
        if (!pwdRegex.test(password)) {
            errors.push('La contraseña debe contener al menos una letra y un número')
        }

        const pwdHash = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            first_name,
            last_name,
            nickname,
            email,
            password: pwdHash,
            level_id: 1
        })

        if (!newUser) return res.status(400).json({ message: 'Error al crear el usuario' })
        
        return res.status(200).json({
            message: 'usuario creado con éxito',
            user: newUser
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error creating account' })
    }
} 