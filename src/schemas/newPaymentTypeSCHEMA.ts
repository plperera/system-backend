import joi from "joi"

const newPaymentTypeSCHEMA = joi.object({

    type: joi.string().required(),
    
})

export {newPaymentTypeSCHEMA}