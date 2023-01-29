import { conflictError, notFoundError, requestError, unauthorizedError } from "@/errors"
import httpStatus from "http-status"
import { newClientBody } from "../../factories/clients-factory"
import clientRepository from "@/repositories/client-repository/client-repository"
import { newAddressBody } from "../../factories/address-factory"
import addressRepository from "@/repositories/address-repository/address-repository"
import { address } from "@prisma/client"
import { newOrdderBody } from "../../factories/ordder-factory"
import { newOrdderWithItensBody } from "@/schemas/newOrdderSCHEMA"
import productRepository from "@/repositories/products-repository/products-repository"
import ordderRepository from "@/repositories/ordder-repository/ordder-repository"

async function findAllOrdders(clientId: number){


}

async function createOrdder(body: newOrdderWithItensBody){

    const {addressId, clientId, userId, itens} = body

    const hasClient = await clientRepository.getClientById(clientId)

    if (!hasClient){
        throw notFoundError()
    }

    const hasAdress = await addressRepository.findManyAddressByClientIdAndId(clientId, addressId)

    if (!hasAdress.length){
        throw notFoundError()
    }
    
    const findAllProduct = await productRepository.findAllProduct()
    const productsHashtable: any = {}

    findAllProduct.map(e => {
        productsHashtable[e.id] = true
    })

    itens.map(e => {
        if (!productsHashtable[e.productId]){
            throw notFoundError()
        }
    })

    const newOrdder = await ordderRepository.createOrdder({addressId, clientId, userId})

    itens.map(e => {
        e["ordderId"] = newOrdder.id
    })
    
    await ordderRepository.createItens(itens)
    const ordderItem = await ordderRepository.findAllItensByOrdderId(newOrdder.id)

    return {
        ...newOrdder,
        ordderItem
    }
    
}
const ordderService = {
    createOrdder,
    findAllOrdders
}

export default ordderService