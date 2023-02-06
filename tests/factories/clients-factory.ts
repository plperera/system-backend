import bcrypt from "bcrypt";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { users } from ".prisma/client";
import { signUpBody } from "./auth-factory";

export type newClientBody = {
    name: string,
    email: string,
    mainNumber: string
    CPForCNPJ: string
}
async function createClientBody() {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        mainNumber: faker.phone.phoneNumber('35 ##### ####')
    }
}

async function createClient(body: newClientBody) {
    return prisma.clients.create({
        data:{
            name: body.name,
            email: body.email,
            mainNumber: body.mainNumber,
            CPForCNPJ:"60744541085"
        }
    })
}

async function findAllClients() {
    return prisma.clients.findMany()
}

async function findClientById(clientId: number) {
    return prisma.clients.findFirst({
        where: {
            id: clientId
        }
    })
}

const clientFactory = {
  createClient,
  createClientBody,
  findAllClients,
  findClientById
}

export default clientFactory