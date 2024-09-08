import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'

export const Hobby = sequelize.define('hobbies', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hobby_type: {
        type: DataTypes.ENUM('actividad', 'objeto'),
        allowNull: false
    }
}, {
    timestamps: true
})