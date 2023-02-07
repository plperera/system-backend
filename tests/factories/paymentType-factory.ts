import faker from "@faker-js/faker";
import { prisma } from "../../src/config";

export type newPaymentTypeBody = {
    type: string,
}
async function generatePaymentTypeValidBody() {
    return {
        type: faker.finance.transactionType() + " - " + faker.address.countryCode('alpha-3'),
    }
    
}
async function createPaymentType(body: newPaymentTypeBody) {
    return prisma.paymentType.create({
        data:{
            type: body.type
        }
    })
}
async function getAllPaymentType() {
    return prisma.paymentType.findMany({})
}
async function getPaymentTypeByType(body: newPaymentTypeBody) {
    return prisma.paymentType.findFirst({
        where: {
            type: body.type
        }
    })
}


const paymentTypeFactory = {
    generatePaymentTypeValidBody,
    createPaymentType,
    getAllPaymentType,
    getPaymentTypeByType
}

export default paymentTypeFactory