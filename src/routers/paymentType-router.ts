import { findAllPaymentTypes, newPaymentType } from '@/controllers/paymentType-controller'
import { authenticateToken } from '@/middlewares/authentication-middlerare'
import { Router } from 'express'

const paymentTypeRouter = Router()

paymentTypeRouter
    .all("/*", authenticateToken)
    .post("", newPaymentType)
    .get("", findAllPaymentTypes)


export { paymentTypeRouter }