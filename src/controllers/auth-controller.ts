import { signupSCHEMA } from "@/schemas/signupSCHEMA";
import authService from "@/services/auth-service/auth-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from 'bcrypt';
import { signUpBody } from "../factories/auth-factory";

export async function signUp(req: Request, res: Response){

    try {

        const isValid = signupSCHEMA.validate(req.body, {abortEarly: false})

        if(isValid.error){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        
        const { email, name, password, passwordVerify } = req.body

        const body: Omit<signUpBody, "passwordVerify"> = {
            email, 
            name, 
            password: bcrypt.hashSync(password, 10), 
        }
        
        if(password !== passwordVerify){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        
        const newUser = await authService.createNewUser(body)

        if(newUser.id){
            return res.sendStatus(httpStatus.CREATED)
        } else {
            return res.sendStatus(httpStatus.CONFLICT)
        }

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