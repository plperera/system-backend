import joi from "joi"
import { signUpBody } from "../factories/auth-factory"

const signupSCHEMA = joi.object<signUpBody>({

    name: joi.string().required(),
    email: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$')),
    password: joi.string().required().min(5),
    passwordVerify: joi.string().required()

})

export {signupSCHEMA}