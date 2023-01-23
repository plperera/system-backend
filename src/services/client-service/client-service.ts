import { conflictError, requestError, unauthorizedError } from "@/errors"
import httpStatus from "http-status"
import { newClientBody } from "../../factories/clients-factory"
import clientRepository from "@/repositories/client-repository/client-repository"

async function createNewClient(body: newClientBody){

    const hasClient = await clientRepository.getClientByName(body.name)
    

    if(hasClient !== null){
        throw conflictError()
    }   

    const newClient = await clientRepository.createNewClient(body)
    
    return newClient
    
}
const clientService = {
    createNewClient
}

export default clientService