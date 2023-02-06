import { prisma } from "@/config";
import { newClientBody } from "../../factories/clients-factory";

async function getClientByUnique(body: newClientBody) {
    return prisma.clients.findFirst({
        where:{
            OR: [
                { 
                    CPForCNPJ: body.CPForCNPJ,
                },
                { 
                    email: body.email,
                },
                { 
                    name: body.name,
                },

            ]
        }
    })
}

async function getClientById(clientId: number) {
    return prisma.clients.findFirst({
        where:{
            id: Number(clientId)
        }
    })
}

async function createNewClient(body: newClientBody){
    return prisma.clients.create({
        data:{
            email: body.email,
            mainNumber: body.mainNumber,
            name: body.name,
            CPForCNPJ: body.CPForCNPJ             
        }
    })
}

async function findManyClients(){
    return prisma.clients.findMany({})
}

const clientRepository = {
    getClientByUnique,
    createNewClient,
    findManyClients,
    getClientById
}

export default clientRepository