import joi from "joi"
import { emit } from "process"
import { newClientBody } from "../factories/clients-factory"


const newClientSCHEMA = joi.object({

    name: joi.string().required().min(3),
    email: joi.string().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$')),
    mainNumber: joi.string().required().min(10),
    CPForCNPJ: joi.string().min(10).max(14).required(),
    
})

export {newClientSCHEMA}