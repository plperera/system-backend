import bcrypt from "bcrypt";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { users } from ".prisma/client";
import { signUpBody } from "./auth-factory";

async function createUser(body: signUpBody) {

    const hashedPassword = await bcrypt.hash(body.password, 10);

    return prisma.users.create({
        data: {
            name:body.name,
            email:body.email,
            password:hashedPassword
        }
    })  

}

async function createSession(body:{token: string, userId: number}) {
    return prisma.sessions.create({
        data:{
            token: body.token,
            userId: body.userId
        }
    })
}

async function getFirstUser() {
    return prisma.users.findFirst()
}

const userFactory = {
  createUser,
  getFirstUser,
  createSession
}

export default userFactory