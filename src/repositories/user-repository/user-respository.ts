import { prisma } from "@/config";

async function findFirst() {
    return prisma.users.findFirst();
}

async function findFirstWithEmail(email:string) {
    return prisma.users.findFirst({
        where:{
            email: email
        }
    });
}

const userRepository = {
    findFirst,
    findFirstWithEmail
}

export default userRepository