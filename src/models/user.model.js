import { DataTypes } from 'sequelize'
import { sequelize } from '../db/db.js'

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_img: {
        type: DataTypes.STRING,
        defaultValue: 'default.png'
    },
    xp: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    title: {
        type: DataTypes.STRING,
        defaultValue: 'Iniciado'
    }, 
    incomes: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    expenses: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    balance: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
}, {
    timestamps: true
})