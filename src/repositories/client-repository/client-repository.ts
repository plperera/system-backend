import { prisma } from "@/config";
import { newClientBody } from "../../factories/clients-factory";

async function getClientByName(name: string) {
    return prisma.clients.findFirst({
        where:{
            name: name
        }
    })
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

const clientRepository = {
    getClientByName,
    createNewClient
}

export default clientRepository