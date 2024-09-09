import { Router } from 'express'
import { createAccount, getProfile, loginAccount } from '../controllers/user.controller.js'
import { validateSchema } from '../middlewares/validator.js'
import { createSchema } from '../schemas/user.schema.js'
import { authRequired } from '../middlewares/checkToken.js'

const router = Router()

router.post('/user', validateSchema(createSchema), createAccount)
router.post('/user/login', loginAccount)
router.get('/user', authRequired, getProfile)

export default router