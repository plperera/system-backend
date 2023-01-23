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

async function findAllClients(){

    const clients = await clientRepository.findManyClients()

    return clients
    
}
const clientService = {
    createNewClient,
    findAllClients
}

export default clientService