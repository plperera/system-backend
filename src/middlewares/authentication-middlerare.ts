import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";

import { prisma } from "@/config";

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");

  if (!authHeader){
    return res.sendStatus(httpStatus.UNAUTHORIZED)
  }

  const token = authHeader.split(" ")[1];

  if (!token){
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const session = await prisma.sessions.findFirst({
      where: {
        token,
      },
    });

    if (!session){
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    req.userId = userId;

    return next();

  } catch (err) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  userId: number;
};
