import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import httpStatus from "http-status";
import supertest from "supertest";
import authFactory from "../factories/auth-factory";
import userFactory from "../factories/user-factory";
import clientFactory from "../factories/clients-factory";
import { cleanDb, generateClientWithAddress, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import addressFactory from "../factories/address-factory";
import productFactory from "../factories/products-factory";
import paymentTypeFactory from "../factories/paymentType-factory"

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});


const server = supertest(app);

describe("POST /payment-type", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.post("/payment-type");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.post("/payment-type").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.post("/payment-type").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 400 when body is blank", async () => {

            const token = await generateValidToken()

            const body = {}

            const response = await server.post("/payment-type").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 400 when body is invalid", async () => {

            const token = await generateValidToken()

            const body = {types: "Dinheiro"}

            const response = await server.post("/payment-type").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 400 when body is invalid", async () => {

            const token = await generateValidToken()

            const body = {type: ""}

            const response = await server.post("/payment-type").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe("when body is valid", () => {

            it("should respond with status 409 when already have a registered TYPE", async () => {

                const token = await generateValidToken()

                const body = await paymentTypeFactory.generatePaymentTypeValidBody()

                await paymentTypeFactory.createPaymentType(body)

                const response = await server.post("/payment-type").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.CONFLICT);

            });

            it("should respond with status 201 when no have a registered TYPE", async () => {

                const token = await generateValidToken()

                const body = await paymentTypeFactory.generatePaymentTypeValidBody()

                const response = await server.post("/payment-type").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.CREATED);

            });

            it("should respond with type Data when no have a registered TYPE", async () => {

                const token = await generateValidToken()

                const body = await paymentTypeFactory.generatePaymentTypeValidBody()

                const response = await server.post("/payment-type").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.body).toMatchObject({
                    type: body.type
                });
               
            });
        })
    })
});