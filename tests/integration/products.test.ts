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
 

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});


const server = supertest(app);

describe("POST /product/new", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.post("/products/new");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.post("/products/new").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.post("/products/new").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 400 when body is blank", async () => {

            const token = await generateValidToken()

            const body = {}

            const response = await server.post("/products/new").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        describe("when body is valid", () => {

            it("should respond with status 409 when already have a registered COD", async () => {

                const token = await generateValidToken()

                const ids = await generateClientWithAddress(token)

                const productBody = await productFactory.generateProductValidBody()
                const product = await productFactory.createProduct(productBody)

                productBody.name = "novo nome"

                const response = await server.post("/products/new").set("Authorization", `Bearer ${token}`).send(productBody)

                expect(response.status).toBe(httpStatus.CONFLICT);

            });

            it("should respond with status 409 when already have a registered name", async () => {

                const token = await generateValidToken()

                const ids = await generateClientWithAddress(token)

                const productBody = await productFactory.generateProductValidBody()
                const product = await productFactory.createProduct(productBody)

                productBody.COD = "novo COD"

                const response = await server.post("/products/new").set("Authorization", `Bearer ${token}`).send(productBody)

                expect(response.status).toBe(httpStatus.CONFLICT);

            });

            it("should respond with status 409 when already have a registered name and COD", async () => {

                const token = await generateValidToken()

                const ids = await generateClientWithAddress(token)

                const productBody = await productFactory.generateProductValidBody()
                const product = await productFactory.createProduct(productBody)

                const response = await server.post("/products/new").set("Authorization", `Bearer ${token}`).send(productBody)

                expect(response.status).toBe(httpStatus.CONFLICT);

            });

            it("should respond with status 201 when no have a registered name and COD", async () => {

                const token = await generateValidToken()

                const ids = await generateClientWithAddress(token)

                const productBody = await productFactory.generateProductValidBody()

                const response = await server.post("/products/new").set("Authorization", `Bearer ${token}`).send(productBody)

                expect(response.status).toBe(httpStatus.CREATED);

            });

            it("should respond with product Data", async () => {

                const token = await generateValidToken()

                const ids = await generateClientWithAddress(token)

                const productBody = await productFactory.generateProductValidBody()

                const response = await server.post("/products/new").set("Authorization", `Bearer ${token}`).send(productBody)

                const product = await productFactory.getProductById(response.body.id)

                delete product.createdAt
                delete product.updatedAt

                expect(response.body).toMatchObject(product);
               

            });
        })
    })
});

describe("GET /product", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.get("/products");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.get("/products").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.get("/products").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 200 with 0 products", async () => {

            const token = await generateValidToken()
            
            for (let i = 1; i < 1; i++){

                await productFactory.createProduct(await productFactory.generateProductValidBody())

            }

            const response = await server.get("/products").set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.OK);

        });

        it("should respond with status 200 with 1 products", async () => {

            const token = await generateValidToken()
            
            for (let i = 1; i <= 1; i++){

                await productFactory.createProduct(await productFactory.generateProductValidBody())

            }

            const response = await server.get("/products").set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.OK);

        });

        it("should respond with status 200 with 15 products", async () => {

            const token = await generateValidToken()
            
            for (let i = 1; i <= 15; i++){

                await productFactory.createProduct(await productFactory.generateProductValidBody())

            }

            const response = await server.get("/products").set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.OK);

        });

        it("should respond with product data with 0 product", async () => {

            const token = await generateValidToken()
            
            for (let i = 1; i < 1; i++){

                await productFactory.createProduct(await productFactory.generateProductValidBody())

            }

            const response = await server.get("/products").set("Authorization", `Bearer ${token}`)

            const allProducts = await productFactory.getAllProducts()

            allProducts.map(e => {
                delete e.updatedAt
                delete e.createdAt
            })

            expect(response.body).toMatchObject(allProducts);

        });

        it("should respond with product data with 1 product", async () => {

            const token = await generateValidToken()
            
            for (let i = 1; i <= 1; i++){

                await productFactory.createProduct(await productFactory.generateProductValidBody())

            }

            const response = await server.get("/products").set("Authorization", `Bearer ${token}`)

            const allProducts = await productFactory.getAllProducts()

            allProducts.map(e => {
                delete e.updatedAt
                delete e.createdAt
            })

            expect(response.body).toMatchObject(allProducts);

        });

        it("should respond with product data with 15 product", async () => {

            const token = await generateValidToken()
            
            for (let i = 1; i <= 15; i++){

                await productFactory.createProduct(await productFactory.generateProductValidBody())

            }

            const response = await server.get("/products").set("Authorization", `Bearer ${token}`)

            const allProducts = await productFactory.getAllProducts()

            allProducts.map(e => {
                delete e.updatedAt
                delete e.createdAt
            })

            expect(response.body).toMatchObject(allProducts);

        });
    })
});
