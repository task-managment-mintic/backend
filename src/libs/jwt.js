import jwt from 'jsonwebtoken'
import { data } from '../config.js'

const pwdToken = data.jwtToken

export const createAccessToken = user => {
    const payload = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        nickname: user.nickname,
        email: user.email,
        profile_img: user.profile_img,
        xp: user.xp,
        level_id: user.level_id,
        title: user.title,
        incomes: user.incomes,
        expenses: user.expenses,
        balance: user.balance
    }

    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            pwdToken,
            {
                expiresIn: '1d'
            }, (error, token) => {
                if (error) {
                    reject(error)
                }
                resolve(token)
            }
        )
    })
}