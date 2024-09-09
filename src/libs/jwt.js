import jwt from 'jsonwebtoken'
import { data } from '../config.js'

const pwdToken = data.jwtToken

export const createAccessToken = user => {
    const payload = {
        id: user.id,
        nickname: user.nickname,
        email: user.email
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