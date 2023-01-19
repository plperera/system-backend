import bcrypt from "bcrypt";
import faker from "@faker-js/faker";
import { prisma } from "@/config";

export type signUpBody = {
  email: string,
  name: string,
  password: string,
  passwordVerify: string
}

function generateValidBody(): signUpBody{
  const email = faker.internet.email()
  const password = faker.internet.password()
  const name = faker.internet.userName()

  return {email, name, password, passwordVerify: password}
}

const authFactory = {
  generateValidBody
}

export default authFactory