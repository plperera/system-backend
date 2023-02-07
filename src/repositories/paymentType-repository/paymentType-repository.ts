import { prisma } from "@/config";
import { newClientBody } from "../../factories/clients-factory";
import { newPaymentTypeBody } from "../../factories/paymentType-factory";
import { newProductBody } from "../../factories/products-factory";

async function findPaymentTypeByType(body: newPaymentTypeBody) {
    return prisma.paymentType.findFirst({
        where:{
            type: body.type
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
    findPaymentTypeByType,
    createPaymentType
}

export default paymentTypeRepository