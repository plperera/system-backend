import joi from "joi"
import { emit } from "process"

const addressIdParamsSCHEMA = joi.object({

    clientId: joi.number().required(),

})

export {addressIdParamsSCHEMA}