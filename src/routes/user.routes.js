import { Router } from 'express'
import { createAccount, getProfile, loginAccount, updateAccount, updatePassword, updateProfileImg } from '../controllers/user.controller.js'
import { validateSchema } from '../middlewares/validator.js'
import { createSchema, updateSchema } from '../schemas/user.schema.js'
import { authRequired } from '../middlewares/checkToken.js'

const router = Router()

router.post('/user', validateSchema(createSchema), createAccount)
router.post('/user/login', loginAccount)
router.get('/user', authRequired, getProfile)
router.put('/user', authRequired, validateSchema(updateSchema), updateAccount)
router.put('/user/img', authRequired, updateProfileImg)
router.put('/user/pwd', authRequired, updatePassword)

export default router