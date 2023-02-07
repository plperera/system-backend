import joi from "joi"
import { emit } from "process"
import { newAddressBody } from "../factories/address-factory"
import { newOrdderBody } from "../factories/ordder-factory"

export type newOrdderWithItensBody = {
    userId: number,
    clientId: number,
    addressId: number,
    itens: {
        productId: number,
        itemAmount: number,
        itemPrice: number,
    }[],
    paymentType: {
        paymentTypeId: number,
        value: number,
    }[]
}

const newOrdderSCHEMA = joi.object<newOrdderWithItensBody>({

    userId: joi.number().required(),
    clientId: joi.number().required(),
    addressId: joi.number().required(),
    itens: joi.array().required(),
    paymentType: joi.array().required()
    
})

export {newOrdderSCHEMA}