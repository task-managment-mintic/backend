import { DataTypes } from 'sequelize'
import { sequelize } from '../db/db.js'
import { User } from './user.model.js'

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
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    timestamps: true
})

User.hasMany(Hobby, { foreignKey: 'user_id' })
Hobby.belongsTo(User, { foreignKey: 'user_id' })