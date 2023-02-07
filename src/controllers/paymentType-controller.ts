import { Request, Response } from "express";
import httpStatus from "http-status";
import clientService from "@/services/client-service/client-service";
import { clients } from "@prisma/client";
import { newAddressSCHEMA } from "@/schemas/newAddressSCHEMA";
import addressRepository from "@/repositories/address-repository/address-repository";
import addressService from "@/services/address-service/address-service";
import { addressIdParamsSCHEMA } from "@/schemas/addressIdParamsSCHEMA";
import { newOrdderSCHEMA } from "@/schemas/newOrdderSCHEMA";
import ordderService from "@/services/ordder-service/ordder-service";
import { newPaymentTypeSCHEMA } from "@/schemas/newPaymentTypeSCHEMA";
import paymentTypeService from "@/services/paymentType-service/paymentType-service";

export async function newPaymentType(req: Request, res: Response){
    try {

        const isValid = newPaymentTypeSCHEMA.validate(req.body, {abortEarly: false})

        if(isValid.error){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const newPaymentType = await paymentTypeService.createPaymentType(req.body)

        return res.status(httpStatus.CREATED).send(newPaymentType)
        
               
    } catch (error) {
        if(error.name === "ConflictError") {
            res.sendStatus(httpStatus.CONFLICT);
        }

        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

