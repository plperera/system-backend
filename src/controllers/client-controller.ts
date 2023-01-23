import { Request, Response } from "express";
import httpStatus from "http-status";
import { newClientSCHEMA } from "@/schemas/newClientSCHEMA ";
import clientService from "@/services/client-service/client-service";
import { clients } from "@prisma/client";

export async function newClient(req: Request, res: Response){
    try {

        const isValid = newClientSCHEMA.validate(req.body, {abortEarly: false})

        if(isValid.error){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        const { name, email, mainNumber } = req.body

        const newClient: clients = await clientService.createNewClient({ name, email, mainNumber })
        
        return res.status(httpStatus.CREATED).send(newClient)
               
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
export async function getAllClients(req: Request, res: Response){
  try {

      const allClients: clients[] = await clientService.findAllClients()

      return res.status(httpStatus.OK).send(allClients)
             
  } catch (error) {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}



