import * as jwt from "jsonwebtoken";

import { prisma } from "@/config";
import authFactory from "./factories/auth-factory";
import userFactory from "./factories/user-factory";

export async function cleanDb() {

  
  await prisma.address.deleteMany({});
  await prisma.clients.deleteMany({});
  await prisma.sessions.deleteMany({});
  await prisma.users.deleteMany({});
  
}

export async function generateValidToken() {

  const body = authFactory.generateValidBody()
  const user = await userFactory.createUser(body)

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  const session = userFactory.createSession({token, userId:user.id})

  return token;

}

