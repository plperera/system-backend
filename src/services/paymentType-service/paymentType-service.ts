import { conflictError, notFoundError, requestError, unauthorizedError } from "@/errors"
import paymentTypeRepository from "@/repositories/paymentType-repository/paymentType-repository"
import productRepository from "@/repositories/products-repository/products-repository"
import { newPaymentTypeBody } from "../../factories/paymentType-factory"

async function createPaymentType(body: newPaymentTypeBody){

    const hasType = await paymentTypeRepository.findPaymentTypeByType(body)

    if (hasType){
        throw conflictError()
    }

    const newType = await paymentTypeRepository.createPaymentType(body)

    return newType
    
}

const paymentTypeService = {
    createPaymentType,
}

export default paymentTypeService