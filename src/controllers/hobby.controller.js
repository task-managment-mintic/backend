import { Hobby } from "../models/hobby.model.js"

export const createHobby = async (req, res) => {
    const { id } = req.user
    const { name, hobby_type } = req.body

    try {
        const newHobby = await Hobby.create({
            name,
            hobby_type,
            user_id: id
        })
        return res.status(200).json({
            message: 'Hobby creado',
            hobby: newHobby
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error creating hobby' })
    }
}

export const getHobbies = async (req, res) => {
    const { id } = req.user

    try {
        const hobbies = await Hobby.findAll({ where: { user_id: id } })
        if (!hobbies) return res.status(404).json({ message: 'El usuario no tiene registrado hobbies' })
        
        return res.status(200).json({
            message: 'Success',
            hobbies: hobbies
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error getting hobbies' })
    }
}

export const getHobby = async (req, res) => {
    const { id } = req.params
    const user_id = req.user.id

    try {
        const hobby = await Hobby.findByPk(id)
        if (!hobby) return res.status(404).json({ message: 'Hobby no encontrado' })
        
        if (hobby.user_id !== user_id) return res.status(403).json({ message: 'No tienes permiso para ver este hobby' })
        
        return res.status(200).json({
            message: 'Solicitud exitosa',
            hobby: hobby
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error getting hobby' })
    }
}