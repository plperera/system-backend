import { getAddress, newAddress } from '@/controllers/address-controller'
import { getAllOrdders, newOrdder } from '@/controllers/ordder-controlle'
import { authenticateToken } from '@/middlewares/authentication-middlerare'
import { Router } from 'express'

const ordderRouter = Router()

ordderRouter
    .all("/*", authenticateToken)
    .post("", newOrdder)
    .get("", getAllOrdders)

export { ordderRouter }