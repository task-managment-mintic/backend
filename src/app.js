import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'

import userRoutes from './routes/user.routes.js'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api', userRoutes)

export default app