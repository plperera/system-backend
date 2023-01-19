import { conflictError } from "@/errors"
import authRepository from "@/repositories/auth-repository/auth-repository"
import userRepository from "@/repositories/user-repository/user-respository"
import httpStatus from "http-status"
import { signUpBody } from "../../factories/auth-factory"


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

const authService = {
    createNewUser
}

export default authService