import * as jwt from "jsonwebtoken";

import { prisma } from "@/config";
import authFactory from "./factories/auth-factory";
import userFactory from "./factories/user-factory";
import clientFactory from "./factories/clients-factory";
import addressFactory from "./factories/address-factory";

export async function cleanDb() {

  await prisma.payments.deleteMany({})
  await prisma.paymentType.deleteMany({})
  await prisma.ordderItem.deleteMany({})
  await prisma.ordder.deleteMany({})
  await prisma.products.deleteMany({})
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

export async function generateClientWithAddress(token: string) {

  const clientBody = await clientFactory.createClientBody()

  const newClient = await clientFactory.createClient(clientBody)

  const body = await addressFactory.generateAddressValidBody(newClient.id)

  const newAddress = await addressFactory.createAddress(body)

  return{
    clientId: newClient.id,
    addressId: newAddress.id
  }

}
