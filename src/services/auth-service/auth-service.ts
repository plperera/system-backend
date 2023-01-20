import { conflictError, requestError, unauthorizedError } from "@/errors"
import authRepository from "@/repositories/auth-repository/auth-repository"
import userRepository from "@/repositories/user-repository/user-respository"
import httpStatus from "http-status"
import { signUpBody } from "../../factories/auth-factory"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { sessions, users } from ".prisma/client"

async function createNewUser(body: Omit<signUpBody, "passwordVerify">){

    try {

        const hasUser = await userRepository.findFirstWithEmail(body.email)
        
        if(hasUser){
            throw conflictError()
        }
        
        const newUser = await authRepository.insertNewUser(body)    

        return newUser

    } catch (error) {
        return error
    }

}
async function verifyAccees(body: {email:string, password:string}){

    try {

        const hasAccess = await userRepository.findFirstWithEmail(body.email)
        
        if(!hasAccess){
            throw unauthorizedError()
        }   

        const isValidPassword = bcrypt.compareSync(body.password, hasAccess.password)
        
        if(!isValidPassword){
            throw unauthorizedError()
        }

        return hasAccess

    } catch (error) {
        return error
    }
}

async function validAccess(body: users) {
    try {

        const {id} = body

        const token = jwt.sign({id}, process.env.JWT_SECRET)

        const session = authRepository.createNewSession({userId:id, token})

        return session

    } catch (error) {
        return error
    }
}
const authService = {
    createNewUser,
    verifyAccees,
    validAccess
}

export default authService