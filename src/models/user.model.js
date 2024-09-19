import { DataTypes } from 'sequelize'
import { sequelize } from '../db/db.js'
import { Level } from './level.model.js'

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
        allowNull: false,
        validate: {
            isUnique: async nickname => {
                const existingNick = await User.findOne({ where: { nickname } })
                if (existingNick) {
                    throw new Error('El nombre de usuario ya está en uso')
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUnique: async email => {
                const existingEmail = await User.findOne({ where: { email } })
                if (existingEmail) {
                    throw new Error('El correo ya está en uso')
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_img: {
        type: DataTypes.STRING,
        defaultValue: 'v1725937229/avatars/default-img-avatar-tskmng-18.jpg'
    },
    xp: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    level_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'levels',
            key: 'id'
        }
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
    }, 
    is_new: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
})

Level.hasMany(User, { foreignKey: 'level_id' })
User.belongsTo(Level, { foreignKey: 'level_id' })