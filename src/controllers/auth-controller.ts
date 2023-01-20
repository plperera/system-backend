import { signupSCHEMA } from "@/schemas/signupSCHEMA";
import { signInSCHEMA } from "@/schemas/signInSCHEMA";
import authService from "@/services/auth-service/auth-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import bcrypt from 'bcrypt';
import { signUpBody } from "../factories/auth-factory";
import { sessions, users } from ".prisma/client";

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

export async function signIn(req: Request, res: Response) {
    try {

        const isValid = signInSCHEMA.validate(req.body, {abortEarly: false})

        if(isValid.error){
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        
        const { email, password } = req.body
        
        const hasAccess: users = await authService.verifyAccees({ email, password })
        
        const validAccess: sessions = await authService.validAccess(hasAccess)

        const userBody = {

            id: hasAccess.id,
            email: hasAccess.email,
            name: hasAccess.name,

        }

        return res.send({user: userBody, token:validAccess.token}).status(httpStatus.OK)
        

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
          
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}

