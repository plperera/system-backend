import { getAllClients, newClient } from '@/controllers/client-controller'
import { getAllProducts, newProduct } from '@/controllers/product-controller'
import { authenticateToken } from '@/middlewares/authentication-middlerare'
import { Router } from 'express'

const productRouter = Router()

productRouter
    .all("/*", authenticateToken)
    .post("/new", newProduct)
    .get("", getAllProducts)
    //.get("/products/:productName", )

export { productRouter }