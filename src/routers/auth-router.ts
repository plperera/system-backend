import { signUp } from '@/controllers/auth-controller'
import { Router } from 'express'

const authRouter = Router()

authRouter
    .post("/sign-up", signUp)
    .post("/sign-in", )

export { authRouter }