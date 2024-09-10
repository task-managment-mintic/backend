import { Router } from 'express'
import { createHobby } from '../controllers/hobby.controller.js'
import { authRequired } from '../middlewares/checkToken.js'
import { validateSchema } from '../middlewares/validator.js'
import { hobbySchema } from '../schemas/hobby.schema.js'

const router = Router()

router.post('/hobby', authRequired, validateSchema(hobbySchema), createHobby)

export default router