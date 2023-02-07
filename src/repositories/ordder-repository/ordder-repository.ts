import { prisma } from "@/config";
import { newClientBody } from "../../factories/clients-factory";
import { newOrdderBody } from "../../factories/ordder-factory";
import { newProductBody } from "../../factories/products-factory";

export type newItensBody = {
    productId: number,
    itemAmount: number,
    itemPrice: number,
    ordderId: number
}[]

async function findAllOrdders() {
    return prisma.ordder.findMany({
        include:{
            ordderItem: true
        }
    })    
}

async function createOrdder(body: newOrdderBody) {
    return prisma.ordder.create({
        data:{
            addressId: body.addressId,
            clientId: body.clientId,
            userId: body.userId
        }
    })    
}

async function createItens(body: newItensBody) {
    return prisma.ordderItem.createMany({
        data:body
    })
}

async function findAllItensByOrdderId(ordderId:number) {
    return prisma.ordderItem.findMany({
        where:{
            ordderId,
        }
    })
}

const ordderRepository = {
    findAllOrdders,
    createOrdder,
    createItens,
    findAllItensByOrdderId
}

export default ordderRepository