import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

export default app