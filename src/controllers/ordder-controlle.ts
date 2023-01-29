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

export async function newOrdder(req: Request, res: Response){
    try {

        const isValid = newOrdderSCHEMA.validate(req.body, {abortEarly: false})

        if(isValid.error){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const newOrdder = await ordderService.createOrdder(req.body)

        return res.status(httpStatus.CREATED).send(newOrdder)
        
               
    } catch (error) {
        if(error.name === "ConflictError") {
            res.sendStatus(httpStatus.CONFLICT);
          }
          if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error);
          }
          if (error.name === "ForbiddenError") {
            return res.status(httpStatus.FORBIDDEN).send(error);
          }
          return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

export async function getAllOrdders(req: Request, res: Response){
  try {
      const {clientId} = req.params

      const isValid = addressIdParamsSCHEMA.validate({clientId}, {abortEarly: false})

      if(isValid.error){
          return res.sendStatus(httpStatus.BAD_REQUEST)
      }
   
      const allAddress = await addressService.findManyAddressByClientId(Number(clientId))
      
      return res.status(httpStatus.OK).send(allAddress)
             
  } catch (error) {
      if(error.name === "ConflictError") {
          res.sendStatus(httpStatus.CONFLICT);
        }
        if (error.name === "NotFoundError") {
          return res.status(httpStatus.NOT_FOUND).send(error);
        }
        if (error.name === "ForbiddenError") {
          return res.status(httpStatus.FORBIDDEN).send(error);
        }
        return res.sendStatus(httpStatus.NOT_FOUND);
  }
}




