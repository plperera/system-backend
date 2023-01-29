import joi from "joi"
import { emit } from "process"
import { newAddressBody } from "../factories/address-factory"
import { newProductBody } from "../factories/products-factory"

const newProductSCHEMA = joi.object<newProductBody>({

    // clientId: joi.number().required(),
    // CEP: joi.string().min(8),
    // cidade: joi.string().required().min(3),
    // rua: joi.string().required().min(3),
    // bairro: joi.string().required().min(3),
    // numero: joi.string().required().min(1),
    // telefone: joi.string().required().min(8),
    COD: joi.string().min(3).required(),
    name: joi.string().min(4).required(),
    defaultPrice: joi.number().required(),
    height: joi.string(),
    width: joi.string(),
    depth: joi.string()
    
})

export {newProductSCHEMA}