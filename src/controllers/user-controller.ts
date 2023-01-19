import userService from "@/services/users-service/user-service";
import { Request, Response } from "express";

export async function getFirstUser(req: Request, res: Response){

    try {
        
        const firstUser = await userService.getFirstUser()
        //const firstUser = "teste"

        res.send(firstUser)

    } catch (error) {
        return res.sendStatus(500)
    }
}