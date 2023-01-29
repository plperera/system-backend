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
import ordderFactory from "../factories/ordder-factory";
 

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});


const server = supertest(app);

describe("POST /ordder", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.post("/ordder");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid and user have a session", () => {

        it("should respond with status 400 when body is blank", async () => {

            const token = await generateValidToken()

            const body = {}

            const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 400 when body doenst have itens", async () => {

            const token = await generateValidToken()

            const user = await userFactory.getFirstUser()

            const ordderBody = ordderFactory.createValidOrdderBody(user.id)

            const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(ordderBody)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);

        });

        it("should respond with status 400 when body have itens butt is empty", async () => {

            const token = await generateValidToken()

            const user = await userFactory.getFirstUser()

            const ordderBody = ordderFactory.createValidOrdderBody(user.id)

            const body = {...ordderBody, itens:[{}]}

            const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);

        });
        
        describe("when body is valid", () => {

            it("should respond with status 404 when client not exist", async () => {

                const token = await generateValidToken()

                const user = await userFactory.getFirstUser()

                const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                ordderBody.clientId = 99999999999

                const body = {
                    ...ordderBody, 
                    itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: product.id }) ]
                }

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.NOT_FOUND);
            })

            it("should respond with status 404 when address not exist", async () => {

                const token = await generateValidToken()

                const user = await userFactory.getFirstUser()

                const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                ordderBody.addressId = 99999999999

                const body = {
                    ...ordderBody, 
                    itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: product.id }) ]
                }

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.NOT_FOUND);
            })

            it("should respond with status 404 when product not exist", async () => {

                const token = await generateValidToken()

                const user = await userFactory.getFirstUser()

                const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                //const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                const body = {
                    ...ordderBody, 
                    itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: 99999999 }) ]
                }

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.NOT_FOUND);
            })

            it("should respond with status 403 when product not exist", async () => {

                const token = await generateValidToken()

                const user = await userFactory.getFirstUser()

                const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                const secondClient = await clientFactory.createClient( await clientFactory.createClientBody())

                const secondAddress = await addressFactory.createAddress( await addressFactory.generateAddressValidBody(secondClient.id))

                ordderBody.addressId = secondAddress.id

                const body = {
                    ...ordderBody, 
                    itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: product.id }) ]
                }

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.FORBIDDEN);
            })

            describe("when body data is valid and have 1 ordderItem", () => {

                it("should respond with status 201", async () => {

                    const token = await generateValidToken()

                    const user = await userFactory.getFirstUser()

                    const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                    const productArray = []

                    for (let i = 1; i <= 1; i++){

                        const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                        const ordderItem = await ordderFactory.createValidBodyItemWithoutOrdderId({productId: product.id})

                        productArray.push(ordderItem)

                    }
                    
                    const body = {
                        ...ordderBody, 
                        itens: productArray
                    }

                    const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                    expect(response.status).toBe(httpStatus.CREATED);

                })

                it("should respond with ordder data", async () => {

                    const token = await generateValidToken()

                    const user = await userFactory.getFirstUser()

                    const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                    const productArray = []

                    for (let i = 1; i <= 1; i++){

                        const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                        const ordderItem = await ordderFactory.createValidBodyItemWithoutOrdderId({productId: product.id})

                        productArray.push(ordderItem)

                    }
                    
                    const body = {
                        ...ordderBody, 
                        itens: productArray
                    }

                    const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                    const ordderData = await ordderFactory.getOrdderById(response.body.id)

                    expect(response.body).toMatchObject(ordderData);

                })

                describe("when body data is valid and have 2 ordderItem", () => {

                    it("should respond with status 201", async () => {
    
                        const token = await generateValidToken()
    
                        const user = await userFactory.getFirstUser()
    
                        const ordderBody = await ordderFactory.createValidOrdderBody(user.id)
    
                        const productArray = []
    
                        for (let i = 1; i <= 2; i++){
    
                            const product = await productFactory.createProduct(await productFactory.generateProductValidBody())
    
                            const ordderItem = await ordderFactory.createValidBodyItemWithoutOrdderId({productId: product.id})
    
                            productArray.push(ordderItem)
    
                        }
                        
                        const body = {
                            ...ordderBody, 
                            itens: productArray
                        }
    
                        const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)
    
                        expect(response.status).toBe(httpStatus.CREATED);
    
                    })
    
                    it("should respond with ordder data", async () => {
    
                        const token = await generateValidToken()
    
                        const user = await userFactory.getFirstUser()
    
                        const ordderBody = await ordderFactory.createValidOrdderBody(user.id)
    
                        const productArray = []
    
                        for (let i = 1; i <= 2; i++){
    
                            const product = await productFactory.createProduct(await productFactory.generateProductValidBody())
    
                            const ordderItem = await ordderFactory.createValidBodyItemWithoutOrdderId({productId: product.id})
    
                            productArray.push(ordderItem)
    
                        }
                        
                        const body = {
                            ...ordderBody, 
                            itens: productArray
                        }
    
                        const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)
    
                        const ordderData = await ordderFactory.getOrdderById(response.body.id)
    
                        expect(response.body).toMatchObject(ordderData);
    
                    })

                    describe("when body data is valid and have 15 ordderItem", () => {

                        it("should respond with status 201", async () => {
        
                            const token = await generateValidToken()
        
                            const user = await userFactory.getFirstUser()
        
                            const ordderBody = await ordderFactory.createValidOrdderBody(user.id)
        
                            const productArray = []
        
                            for (let i = 1; i <= 15; i++){
        
                                const product = await productFactory.createProduct(await productFactory.generateProductValidBody())
        
                                const ordderItem = await ordderFactory.createValidBodyItemWithoutOrdderId({productId: product.id})
        
                                productArray.push(ordderItem)
        
                            }
                            
                            const body = {
                                ...ordderBody, 
                                itens: productArray
                            }
        
                            const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)
        
                            expect(response.status).toBe(httpStatus.CREATED);
        
                        })
        
                        it("should respond with ordder data", async () => {
        
                            const token = await generateValidToken()
        
                            const user = await userFactory.getFirstUser()
        
                            const ordderBody = await ordderFactory.createValidOrdderBody(user.id)
        
                            const productArray = []
        
                            for (let i = 1; i <= 15; i++){
        
                                const product = await productFactory.createProduct(await productFactory.generateProductValidBody())
        
                                const ordderItem = await ordderFactory.createValidBodyItemWithoutOrdderId({productId: product.id})
        
                                productArray.push(ordderItem)
        
                            }
                            
                            const body = {
                                ...ordderBody, 
                                itens: productArray
                            }
        
                            const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)
        
                            const ordderData = await ordderFactory.getOrdderById(response.body.id)
        
                            expect(response.body).toMatchObject(ordderData);
        
                        })
        
                    })
    
                })

            })

        }) 
        
    })
});

describe("GET /ordder", () => {

    it("should respond with status 401 if no token is given", async () => {

        const response = await server.get("/ordder");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();

        const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);

    });

    it("should respond with status 401 if there is no session for given token", async () => {

        const body = authFactory.generateValidBody()
        const user = await userFactory.createUser(body);
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    
    describe("when token is valid and no have ordders yet", () => {

        it("should respond with status 200", async () => {

            const token = await generateValidToken()

            const user = await userFactory.getFirstUser()

            const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.OK);

        })

        it("should respond with ordder data", async () => {

            const token = await generateValidToken()

            const user = await userFactory.getFirstUser()

            const ordderData = await ordderFactory.getAllOrdders()

            const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)

            expect(response.body).toEqual(ordderData);

        })

        describe("when token is valid and have 1 ordderItem", () => {

            it("should respond with status 200", async () => {
    
                const token = await generateValidToken()
    
                const user = await userFactory.getFirstUser()
    
                await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:1})
    
                const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
    
                expect(response.status).toBe(httpStatus.OK);
    
            })
    
            it("should respond with ordder data", async () => {
    
                const token = await generateValidToken()
    
                const user = await userFactory.getFirstUser()
    
                await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:1})
    
                const ordderData = await ordderFactory.getAllOrdders()
    
                const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
    
                expect(response.body).toEqual(ordderData);
    
            })
    
            describe("when body data is valid and have 15 ordderItem", () => {
    
                it("should respond with status 200", async () => {
    
                    const token = await generateValidToken()
    
                    const user = await userFactory.getFirstUser()
        
                    await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:15})
        
                    const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
        
                    expect(response.status).toBe(httpStatus.OK);
    
                })
    
                it("should respond with ordder data", async () => {
    
                    const token = await generateValidToken()
    
                    const user = await userFactory.getFirstUser()
        
                    await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:15})
        
                    const ordderData = await ordderFactory.getAllOrdders()
        
                    const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
        
                    expect(response.body).toEqual(ordderData);
    
                })
            })
        })
    
        describe("when token is valid and have 2 ordders and 1 ordderItem", () => {
    
            it("should respond with status 200", async () => {
    
                const token = await generateValidToken()
    
                const user = await userFactory.getFirstUser()
    
                await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:1})
                await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:1})
    
                const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
    
                expect(response.status).toBe(httpStatus.OK);
    
            })
    
            it("should respond with ordder data", async () => {
    
                const token = await generateValidToken()
    
                const user = await userFactory.getFirstUser()
    
                await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:1})
                await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:1})
    
                const ordderData = await ordderFactory.getAllOrdders()
    
                const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
    
                expect(response.body).toEqual(ordderData);
    
            })
    
            describe("when token is valid and have 2 ordders and 15 ordderItem", () => {
    
                it("should respond with status 200", async () => {
    
                    const token = await generateValidToken()
    
                    const user = await userFactory.getFirstUser()
        
                    await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:15})
                    await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:15})
        
                    const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
        
                    expect(response.status).toBe(httpStatus.OK);
    
                })
    
                it("should respond with ordder data", async () => {
    
                    const token = await generateValidToken()
    
                    const user = await userFactory.getFirstUser()
        
                    await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:15})
                    await ordderFactory.createFullOrdder({userId: user.id, numberOfItens:15})
        
                    const ordderData = await ordderFactory.getAllOrdders()
        
                    const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
        
                    expect(response.body).toEqual(ordderData);
    
                })
            })
        })

    })
    
});