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
        if (error.name === 'SequelizeValidationError') {
            const errs = error.errors.map(err => err)
            errors.push(...errs)
        } else {
            return res.status(500).json({
                message: 'Error interno al validar',
                errors: error
            })
        }

        return res.status(400).json({
            message: 'Error en la validación',
            errors: errors
        })
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

export const getProfile = async (req, res) => {
    const { id } = req.user
    
    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['id', 'password'] }
        })
        if (!user) return res.status(404).json({ message: ' El usuario no existe' })
        
        return res.status(200).json({
            message: 'Solicitud exitosa',
            user: user
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error getting profile' })
    }
}

export const updateAccount = async (req, res) => {
    const { id } = req.user
    const { first_name, last_name, email, nickname } = req.body

    try {
        const user = await User.findByPk(id)
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
        
        if (nickname && nickname !== '') {
            const existingNick = await User.findOne({ where: { nickname } })
            if (existingNick && existingNick.id !== id) return res.status(404).json({ message: 'El nombre de usuario ya está en uso' }) 
        }
        
        if (email && email !== '') {
            const existingEmail = await User.findOne({ where: { email } })
            if (existingEmail && existingEmail.id !== id) return res.status(404).json({ message: 'El correo ya está en uso' })
        }
        
        user.first_name = first_name || user.first_name
        user.last_name = last_name || user.last_name
        user.email = email || user.email
        user.nickname = nickname || user.nickname

        const updatedUser = await user.save()

        return res.status(200).json({
            message: 'Datos actualizados',
            user: updatedUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating account' })
    }
}

export const updateProfileImg = async (req, res) => {
    const { id } = req.user
    const { avatar } = req.body

    try {
        const imgUpdated = User.update(
            { profile_img: avatar },
            { where: { id } }
        )
        return res.status(200).json({
            message: 'Imagen actualizada',
            user: imgUpdated
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error updating profile image' })
    }
}

export const updatePassword = async (req, res) => {
    const { id } = req.user
    const { currentPassword, password } = req.body

    try {
        const user = await User.findByPk(id)
        if (!user) return res.status(404).json({ messsage: 'Usuario no existe' })
        
        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' })
        
        const newPwdHash = await bcrypt.hash(password, 10)
        user.password = newPwdHash
        const userUpdated = user.save()
        return res.status(200).json({
            message: 'La contraseña ha sido actualizada',
            user: userUpdated
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error updating password' })
    }
}