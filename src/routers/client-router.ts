import { signIn, signUp } from '@/controllers/auth-controller'
import { newClient } from '@/controllers/client-controller'
import { authenticateToken } from '@/middlewares/authentication-middlerare'
import { Router } from 'express'

const clientRouter = Router()

clientRouter
    .all("/*", authenticateToken)
    .post("", newClient)
    .get("", )
    //.get("/clients/:clientId", )

export { clientRouter }