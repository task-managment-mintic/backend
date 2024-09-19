import bcrypt from 'bcryptjs'
import { User } from '../models/user.model.js'
import { Op } from 'sequelize'
import { createAccessToken } from '../libs/jwt.js'
import { Level } from '../models/level.model.js'

export const createAccount = async (req, res) => {
    const {
        first_name,
        last_name,
        nickname,
        email,
        password,
        confirm_password
    } = req.body
    const errors = []

    try {
        console.log('Inicialización con errores: ', errors)
        if (!confirm_password) {
            errors.push({ message: 'Debes escribir nuevamente la contraseña' })
        }

        if (password !== confirm_password) {
            errors.push({ message: 'Las contraseñas no coinciden' })
        }

        if (errors.length > 0) {
            console.log('Errores: ', errors.map(err => err))
            return res.status(400).json({ errors })
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
        
        const level = await Level.findOne({ where: { id: user.level_id } })
        if (!level) return res.status(404).json({ message: 'Nivel no encontrado' })
        
        const nextLevel = await Level.findOne({ where: { level_num: level.level_num + 1 } })
        
        return res.status(200).json({
            message: 'Solicitud exitosa',
            user: {
                ...user,
                level_num: level.level_num,
                xp_required: nextLevel ? nextLevel.xp_required : 'N/A'
            }
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
        const findUpdatedUser = await User.findByPk(updatedUser.id, {
            attributes: { exclude: ['id', 'password'] }
        })

        return res.status(200).json({
            message: 'Datos actualizados',
            user: findUpdatedUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating account' })
    }
}

export const updateProfileImg = async (req, res) => {
    const { id } = req.user
    const { profile_img } = req.body

    try {
        const [updatedRows] = await User.update(
            { profile_img },
            { where: { id } }
        )
        if (updatedRows === 0) return res.status(400).json({
            message: 'Error al actualizar'
        })
        
        return res.status(200).json({
            message: 'Imagen actualizada'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating profile image', error })
    }
}

export const updatePassword = async (req, res) => {
    const { id } = req.user
    const { current_password, password, confirm_password } = req.body
    const errors = []

    try {
        const user = await User.findByPk(id)
        if (!user) return res.status(404).json({ messsage: 'Usuario no existe' })
        
        if (!current_password || !confirm_password || !password) {
            return res.status(404).json({ message: 'Campos vacíos' })
        }
        
        const isMatch = await bcrypt.compare(current_password, user.password)

        if (!isMatch) {
            errors.push('Contraseña incorrecta')
        }
        
        if (current_password === password) {
            errors.push('La nueva contraseña no puede ser igual a la anterior')
        }
        
        if (password !== confirm_password) {
            errors.push('Las contraseñas no coinciden')
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }
        
        const newPwdHash = await bcrypt.hash(password, 10)
        user.password = newPwdHash
        await user.save()
        return res.status(200).json({
            message: 'La contraseña ha sido actualizada'
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error updating password' })
    }
}

export const updateIsNew = async (req, res) => {
    const { id } = req.user
    
    try {
        const userUpdated = await User.update(
            { is_new: false },
            { where: { id: id }}
        )
        return res.status(200).json({
            message: 'Success',
            user: userUpdated.is_new
        })    
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error updating is_new' })
    }
}