import { prisma } from "@/config";
import { signUpBody } from "../../factories/auth-factory";

async function insertNewUser(body: Omit<signUpBody, "passwordVerify">) {
    return prisma.users.create({
        data:{
            email: body.email,
            name: body.name,
            password: body.password
        }
    });
}

const authRepository = {
    insertNewUser
}

export default authRepository