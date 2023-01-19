import * as jwt from "jsonwebtoken";

import { prisma } from "@/config";

export async function cleanDb() {

  await prisma.sessions.deleteMany({});
  await prisma.users.deleteMany({});
  
}
/*
export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
*/
