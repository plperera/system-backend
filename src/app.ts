import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

import { loadEnv, connectDb, disconnectDB } from "@/config";
import { userRouter } from "./routers/user-router";
import { authRouter } from "./routers/auth-router";
import { clientRouter } from "./routers/client-router";
import { addressRouter } from "./routers/address-router";
import { productRouter } from "./routers/product-router";
import { ordderRouter } from "./routers/ordder-router";

loadEnv();


const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/address", addressRouter)
  .use("/user", userRouter)
  .use("/clients", clientRouter)
  .use("/auth", authRouter)
  .use("/products", productRouter)
  .use("/ordder", ordderRouter)

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
