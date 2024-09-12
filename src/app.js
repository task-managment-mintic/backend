import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import userRoutes from './routes/user.routes.js'
import hobbyRoutes from './routes/hobby.routes.js'

const app = express()

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api', userRoutes)
app.use('/api', hobbyRoutes)

export default app