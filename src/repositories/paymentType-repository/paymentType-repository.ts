import { prisma } from "@/config";
import { newClientBody } from "../../factories/clients-factory";
import { newPaymentTypeBody } from "../../factories/paymentType-factory";
import { newProductBody } from "../../factories/products-factory";

async function findAllPaymentType() {
    return prisma.paymentType.findMany({})
}

async function findPaymentTypeByType(type: string) {
    return prisma.paymentType.findMany({
        where: {
            type: type
        }
    })
}


async function createPaymentType(body: newPaymentTypeBody) {
    return prisma.paymentType.create({
        data:{
            type: body.type,
        }
    })    
}

const paymentTypeRepository = {
    findAllPaymentType,
    createPaymentType,
    findPaymentTypeByType
}

export default paymentTypeRepository