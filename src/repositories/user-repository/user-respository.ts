import { prisma } from "@/config";

async function findFirst() {
    return prisma.users.findFirst();
}

const userRepository = {
    findFirst
}

export default userRepository