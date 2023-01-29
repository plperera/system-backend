import { prisma } from "@/config";
import { newAddressBody } from "../../factories/address-factory";
import {  } from "../../factories/clients-factory";

async function findManyAddressByClientId(clientId: number) {
    return prisma.address.findMany({
        where:{
            clientId: clientId
        }
    }) 
}

async function findManyAddressByClientIdAndId(clientId: number, addressId: number) {
    return prisma.address.findMany({
        where:{
            clientId: clientId,
            AND:{
                id: addressId
            }
        }
    }) 
}

async function createAddress(body: newAddressBody){
    return prisma.address.create({
        data:{
            CEP: body.CEP,
            bairro: body.bairro,
            cidade: body.cidade,
            clientId: Number(body.clientId),
            numero: body.numero,
            rua: body.rua,
            telefone: body.telefone,
        }
    })
}
const addressRepository = {
    findManyAddressByClientId,
    findManyAddressByClientIdAndId,
    createAddress
}

export default addressRepository