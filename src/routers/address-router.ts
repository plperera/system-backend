import { getAddress, newAddress } from '@/controllers/address-controller'
import { authenticateToken } from '@/middlewares/authentication-middlerare'
import { Router } from 'express'

const addressRouter = Router()

addressRouter
    .all("/*", authenticateToken)
    .post("", newAddress)
    .get("/all/:clientId", getAddress)
    //.get("/unique/:addressId", )

export { addressRouter }