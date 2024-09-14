import { Router } from 'express'
import { createHobby, getHobbies, getHobby } from '../controllers/hobby.controller.js'
import { authRequired } from '../middlewares/checkToken.js'
import { validateSchema } from '../middlewares/validator.js'
import { hobbySchema } from '../schemas/hobby.schema.js'

const router = Router()

router.post('/hobby', authRequired, validateSchema(hobbySchema), createHobby)
router.get('/hobby', authRequired, getHobbies)
router.get('/hobby/:id', authRequired, getHobby)

export default router