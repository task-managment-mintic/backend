import { DataTypes } from 'sequelize'
import { sequelize } from '../db/db.js'

export const Level = sequelize.define('levels', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    level_num: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    xp_required: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    reward: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
})