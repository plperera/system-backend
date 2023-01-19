import userRepository from "@/repositories/user-repository/user-respository";

async function getFirstUser(){

    try {
        
        const firstUser = await userRepository.findFirst()

        return firstUser

    } catch (error) {
        return error
    }

}

const userService = {
    getFirstUser
}

export default userService