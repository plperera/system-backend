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
import ordderRepository, { newItensBody } from "@/repositories/ordder-repository/ordder-repository"
import paymentTypeRepository from "@/repositories/paymentType-repository/paymentType-repository"
import e from "express"
import paymentRepository from "@/repositories/payment-repository/payment-repository"
import { newPaymentBody } from "../../factories/payment-factory"

async function findAllOrdders(){

    const allOrdders = await ordderRepository.findAllOrdders()

    return allOrdders

}

async function createOrdder(body: newOrdderWithItensBody){

    const {addressId, clientId, userId, itens, paymentType} = body

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

    const findAllPaymentTypes = await paymentTypeRepository.findAllPaymentType()
    const PaymentTypesHashtable: any = {}

    /*
    findAllPaymentTypes.map(e => {
        PaymentTypesHashtable[e.id] = true
    })
    
    paymentType.map(e => {
        if (!productsHashtable[e.paymentTypeId]){
            throw notFoundError()
        }
    })
    */
    paymentType.map(e => {
        if (!findAllPaymentTypes.find(arr => arr.id === e.paymentTypeId)){
            throw notFoundError()
        }
    })
    
    const itemAmount = itens.reduce((total, num) => num.productId === 26 ? (total - num.itemAmount * num.itemPrice):(total + num.itemAmount * num.itemPrice), 0)
    const paymentAmount = paymentType.reduce((total, num) => total + num.value, 0)

    if (itemAmount !== paymentAmount){
        throw unauthorizedError()
    }

    const newOrdder = await ordderRepository.createOrdder({addressId, clientId, userId})

    const itensWithOrderId: newItensBody = itens.map(e => Object.assign({}, e, {ordderId: newOrdder.id}))
    const paymentTypeWithOrderId: newPaymentBody[] = paymentType.map(e => Object.assign({}, e, {ordderId: newOrdder.id}))
    
    await ordderRepository.createItens(itensWithOrderId)
    await paymentRepository.createManyPayments(paymentTypeWithOrderId)
    
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