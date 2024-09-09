import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'

export const Level = sequelize.define('levels', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    level_num: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reward: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
})