import faker from "@faker-js/faker";
import { prisma } from "../../src/config";

export type newPaymentBody = {
    ordderId: number,
    paymentTypeId: number,
    value: number,
}
async function generatePaymentTypeValidBody(paymentTypeId: number) {
    return {
        paymentTypeId: Number(paymentTypeId),
        value: Number(faker.random.numeric(4)),
    }
}
async function createPayment(body: newPaymentBody) {
    return prisma.payments.create({
        data:{
            ordderId: body.ordderId,
            paymentTypeId: body.paymentTypeId,
            value: body.value
        }
    })
}
async function getAllPayment() {
    return prisma.payments.findMany({})
}


const paymentFactory = {
    generatePaymentTypeValidBody,
    createPayment,
    getAllPayment
}

export default paymentFactory