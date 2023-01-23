import joi from "joi"
import { emit } from "process"
import { newAddressBody } from "../factories/address-factory"

const newAddressSCHEMA = joi.object<newAddressBody>({

    clientId: joi.number().required(),
    CEP: joi.string().min(8),
    cidade: joi.string().required().min(3),
    rua: joi.string().required().min(3),
    bairro: joi.string().required().min(3),
    numero: joi.string().required().min(1),
    telefone: joi.string().required().min(8),
    
})

export {newAddressSCHEMA}