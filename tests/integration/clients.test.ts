import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import httpStatus from "http-status";
import supertest from "supertest";
import authFactory from "../factories/auth-factory";
import userFactory from "../factories/user-factory";
import clientFactory from "../factories/clients-factory";
import { cleanDb, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
 

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});


const server = supertest(app);

describe("POST /clients", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.post("/clients");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.post("/clients").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.post("/clients").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 400 when name is blank", async () => {

            const token = await generateValidToken()

            const body = await clientFactory.createClientBody()
            body.name = ""

            const response = await server.post("/clients").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 400 when mainNumber is blank", async () => {

            const token = await generateValidToken()

            const body = await clientFactory.createClientBody()
            body.mainNumber = ""

            const response = await server.post("/clients").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe("when body is valid", () => {

            it("should respond with status 409 when already have a registered client", async () => {

                const token = await generateValidToken()
    
                const body = await clientFactory.createClientBody()

                const client = await clientFactory.createClient(body)
        
                const response = await server.post("/clients").set("Authorization", `Bearer ${token}`).send(body)
    
                expect(response.status).toBe(httpStatus.CONFLICT);
            });

            it("should not enter the client in the bank", async () => {

                const token = await generateValidToken()
    
                const body = await clientFactory.createClientBody()

                await clientFactory.createClient(body)
        
                const response = await server.post("/clients").set("Authorization", `Bearer ${token}`).send(body)

                const allClients = await clientFactory.findAllClients()
    
                expect(allClients.length).toEqual(1);
            });

            it("should respond with status 201 when already have a registered client", async () => {

                const token = await generateValidToken()
    
                const body = await clientFactory.createClientBody()
        
                const response = await server.post("/clients").set("Authorization", `Bearer ${token}`).send(body)
    
                expect(response.status).toBe(httpStatus.CREATED);
            });

            it("should respond with client Data", async () => {

                const token = await generateValidToken()
    
                const body = await clientFactory.createClientBody()
        
                const response = await server.post("/clients").set("Authorization", `Bearer ${token}`).send(body)

                const allClients = await clientFactory.findAllClients()

                delete allClients[0].createdAt
                delete allClients[0].updatedAt
    
                expect(response.body).toMatchObject(allClients[0]);
            });
        })
    })
});
/*
describe("GET /clients", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.get("/clients");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.get("/clients").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.get("/clients").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 201 when already have a registered client", async () => {

            const token = await generateValidToken()

            const body = await clientFactory.createClientBody()
    
            const response = await server.get("/clients").set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.OK);
        });

        it("should respond with client Data (0 clients)", async () => {

            const token = await generateValidToken()
    
            const response = await server.get("/clients").set("Authorization", `Bearer ${token}`)

            const allClients = await clientFactory.findAllClients()

            expect(response.body).toEqual(allClients);
        });

        it("should respond with client Data", async () => {

            const token = await generateValidToken()

            const body = await clientFactory.createClientBody()

            const client = await clientFactory.createClient(body)
    
            const response = await server.get("/clients").set("Authorization", `Bearer ${token}`)

            const allClients = await clientFactory.findAllClients()

            expect(response.body).toEqual(allClients);
        });
        
    })
});

describe("GET /client/:clientId", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.get("/clients/1");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.get("/clients/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.get("/clients/1").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 200 when already have a registered client", async () => {

            const token = await generateValidToken()

            const body = await clientFactory.createClientBody()

            const client = await clientFactory.createClient(body)
    
            const response = await server.get(`/clients/${client.id}`).set("Authorization", `Bearer ${token}`)

            const clientByFind = await clientFactory.findClientById(client.id)

            expect(response.status).toBe(httpStatus.OK);
        });

        it("should respond with client data when already have a registered client", async () => {

            const token = await generateValidToken()

            const body = await clientFactory.createClientBody()

            const client = await clientFactory.createClient(body)
    
            const response = await server.get(`/clients/${client.id}`).set("Authorization", `Bearer ${token}`)

            const clientByFind = await clientFactory.findClientById(client.id)

            expect(response.body).toEqual(clientByFind);
        });

        it("should respond with status 404 when dont have a registered client", async () => {

            const token = await generateValidToken()
    
            const response = await server.get(`/clients/999999999999999`).set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with client data when already have a registered client", async () => {

            const token = await generateValidToken()
    
            const response = await server.get(`/clients/999999999999999`).set("Authorization", `Bearer ${token}`)

            const clientByFind = await clientFactory.findClientById(999999999999999)

            expect(response.body).toEqual(clientByFind);
        });
        
    })
});
*/