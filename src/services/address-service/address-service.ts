import { conflictError, notFoundError, requestError, unauthorizedError } from "@/errors"
import httpStatus from "http-status"
import { newClientBody } from "../../factories/clients-factory"
import clientRepository from "@/repositories/client-repository/client-repository"
import { newAddressBody } from "../../factories/address-factory"
import addressRepository from "@/repositories/address-repository/address-repository"
import { address } from "@prisma/client"

async function findManyAddressByClientId(clientId: number){


}

async function createAddress(body: newAddressBody){

    const hasClient = await clientRepository.getClientById(body.clientId)

    if (!hasClient){
        throw notFoundError()
    }

    const newAddress: address = await addressRepository.createAddress(body)

    return newAddress
    
}
const addressService = {
    findManyAddressByClientId,
    createAddress
}

export default addressService