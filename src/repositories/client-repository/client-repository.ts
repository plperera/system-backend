import { prisma } from "@/config";
import { newClientBody } from "../../factories/clients-factory";

async function getClientByName(name: string) {
    return prisma.clients.findFirst({
        where:{
            name: name
        }
    })
}

async function getClientById(clientId: number) {
    return prisma.clients.findFirst({})
}

async function createNewClient(body: newClientBody){
    return prisma.clients.create({
        data:{
            email: body.email,
            mainNumber: body.mainNumber,
            name: body.name    
        }
    })
}

async function findManyClients(){
    return prisma.clients.findMany({})
}

const clientRepository = {
    getClientByName,
    createNewClient,
    findManyClients,
    getClientById
}

export default clientRepository