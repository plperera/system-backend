import joi from "joi"
import { signUpBody } from "../factories/auth-factory"

const signInSCHEMA = joi.object<signUpBody>({

    email: joi.string().required().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$')),
    password: joi.string().required().min(5)

})

export {signInSCHEMA}