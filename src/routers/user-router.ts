import { Router } from 'express'
import { getFirstUser } from '@/controllers/user-controller'

const userRouter = Router()

userRouter
    .get("/first", getFirstUser)

export { userRouter }