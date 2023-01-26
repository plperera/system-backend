import bcrypt from "bcrypt";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { users } from ".prisma/client";
import { signUpBody } from "./auth-factory";

export type newProductBody = {
    COD: string,
    name: string,
    defaultPrice: number,
    height: string,
    width: string,
    depth: string
}
async function generateProductValidBody() {

    return {
        COD: faker.random.alpha(4),
        name: faker.commerce.product(),
        defaultPrice: Number(faker.commerce.price(100,10000,0)),
        height: faker.random.numeric(2) + "0",
        width: faker.random.numeric(2) + "0",
        depth: faker.random.numeric(2) + "0"
    }
    
}
async function createProduct(body: newProductBody) {
    return prisma.products.create({
        data:{
            COD: body.COD,
            name: body.name,
            defaultPrice: body.defaultPrice,
            height: body.height,
            width: body.width,
            depth: body.depth
        }
    }) 
}

async function getAllProducts() {
    return prisma.products.findMany({})
}


const productFactory = {
    createProduct,
    getAllProducts,
    generateProductValidBody
}

export default productFactory