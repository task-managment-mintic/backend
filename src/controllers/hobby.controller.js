import { Hobby } from "../models/hobby.model.js"

export const createHobby = (req, res) => {
    const { id } = req.user
    const { name, hobby_type } = req.body

    try {
        const newHobby = Hobby.create({
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