import { prisma } from "@/config";
import { newClientBody } from "../../factories/clients-factory";
import { newProductBody } from "../../factories/products-factory";

async function findByNameOrCOD(body: { name: string, COD: string}) {
    return prisma.products.findFirst({
        where:{
            OR: [
                {
                    name: body.name
                },
                {
                    COD: body.COD
                }
            ]
        }
    })
}

async function createProduct(body: newProductBody) {
    return prisma.products.create({
        data:{
            COD: body.COD,
            defaultPrice: body.defaultPrice,
            depth: body.depth || null,
            width: body.width || null,
            height: body.height || null,
            name: body.name
        }
    })    
}

const productRepository = {
    findByNameOrCOD,
    createProduct
}

export default productRepository