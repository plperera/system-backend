import { Request, Response } from "express";
import httpStatus from "http-status";
import { newClientSCHEMA } from "@/schemas/newClientSCHEMA ";
import clientService from "@/services/client-service/client-service";
import { clients } from "@prisma/client";
import { newProductSCHEMA } from "@/schemas/newProductSCHEMA";
import productService from "@/services/product-service/product-service";

export async function newProduct(req: Request, res: Response) {

    try {

        const isValid = newProductSCHEMA.validate(req.body, {abortEarly: false})

        if(isValid.error){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }

        const newProduct = await productService.createProduct(req.body)

        return res.status(httpStatus.CREATED).send(newProduct)

        
    } catch (error) {

        if (error.name === "UnauthorizedError") {
            return res.status(httpStatus.UNAUTHORIZED);
          }
        if(error.name === "ConflictError") {
            res.sendStatus(httpStatus.CONFLICT);
          }
        if (error.name === "NotFoundError") {
            return res.status(httpStatus.NOT_FOUND).send(error);
        }
        if (error.name === "ForbiddenError") {
            return res.status(httpStatus.FORBIDDEN).send(error);
        }
          
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);

    }
}



