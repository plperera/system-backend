import { getAllClients, newClient } from '@/controllers/client-controller'
import { newProduct } from '@/controllers/product-controller'
import { authenticateToken } from '@/middlewares/authentication-middlerare'
import { Router } from 'express'

const productRouter = Router()

productRouter
    .all("/*", authenticateToken)
    .post("/new", newProduct)
    .get("", )
    //.get("/products/:productName", )

export { productRouter }