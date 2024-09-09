import { Router } from 'express'
import { createAccount } from '../controllers/user.controller.js'
import { validateSchema } from '../middlewares/validator.js'
import { createSchema } from '../schemas/user.schema.js'

const router = Router()

router.post('/user', validateSchema(createSchema), createAccount)

export default router