import bcrypt from 'bcryptjs'
import { User } from '../models/user.model.js'
import { Op } from 'sequelize'
import { createAccessToken } from '../libs/jwt.js'

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

export const loginAccount = async (req, res) => {
    const { logger, password } = req.body

    try {
        if (!logger || !password) return res.status(400).json({ message: 'Campos vacíos' })
        
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { nickname: logger },
                    { email: logger }
                ]
            }
        })

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' })
        
        const token = await createAccessToken(user)
        res.setHeader('Authorization', token)
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: user,
            token: token
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error creating account' })
    }
}