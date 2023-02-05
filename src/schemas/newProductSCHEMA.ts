import joi from "joi"
import { emit } from "process"
import { newAddressBody } from "../factories/address-factory"
import { newProductBody } from "../factories/products-factory"

const newProductSCHEMA = joi.object<newProductBody>({

    COD: joi.string().min(3).required(),
    name: joi.string().min(4).required(),
    defaultPrice: joi.number().required(),
    height: joi.string(),
    width: joi.string(),
    depth: joi.string()
    
})

export {newProductSCHEMA}