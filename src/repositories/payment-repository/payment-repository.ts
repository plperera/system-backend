import { prisma } from "@/config";
import { newClientBody } from "../../factories/clients-factory";
import { newPaymentBody } from "../../factories/payment-factory";
import { newPaymentTypeBody } from "../../factories/paymentType-factory";
import { newProductBody } from "../../factories/products-factory";

async function createManyPayments(body: newPaymentBody[]) {
    return prisma.payments.createMany({
        data: body
    })    
}

const paymentRepository = {
    createManyPayments
}

export default paymentRepository