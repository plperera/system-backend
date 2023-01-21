import bcrypt from "bcrypt";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { users } from ".prisma/client";
import { signUpBody } from "./auth-factory";

export type newAddressBody = {
    clientId: number,
    CEP?: string,
    cidade: string,
    rua: string,
    bairro: string,
    numero: string,
    telefone: string
}
async function generateAddressValidBody(clientId: number) {

    return {
        clientId: clientId,
        CEP: faker.address.zipCode('########'),
        cidade: faker.address.cityName(),
        rua: faker.address.streetName(),
        bairro: faker.address.cityPrefix(),
        numero: faker.address.buildingNumber(),
        telefone: faker.phone.phoneNumber('35 ##### ####')
    }
    
}
async function createAddress(body: newAddressBody) {
    return prisma.address.create({
        data:{
            clientId: body.clientId,
            CEP: body.CEP,
            cidade: body.cidade,
            rua: body.rua,
            bairro: body.bairro,
            numero: body.numero,
            telefone: body.telefone
        }
    }) 
}

async function getAllClientAddress(clientId: number) {
    return prisma.address.findMany({
        where:{
            clientId: clientId
        }
    })
}

async function getAddressById(addressId: number) {
    return prisma.address.findMany({
        where:{
            id: addressId
        }
    })
}

const addressFactory = {
  createAddress,
  getAllClientAddress,
  getAddressById,
  generateAddressValidBody
}

export default addressFactory