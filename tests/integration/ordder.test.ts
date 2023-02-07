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
import { newOrdderWithItensBody } from "../../src/schemas/newOrdderSCHEMA"
import paymentFactory from "../factories/payment-factory";
import paymentTypeFactory from "../factories/paymentType-factory";
 

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
        
        it("should respond with status 400 when body doenst have payment types", async () => {

            const token = await generateValidToken()

            const user = await userFactory.getFirstUser()

            const ordderBody = ordderFactory.createValidOrdderBody(user.id)

            const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

            const body = {
                ...ordderBody, 
                itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: product.id }) ]
            }

            const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 400 when body have payment types butt is empty", async () => {

            const token = await generateValidToken()

            const user = await userFactory.getFirstUser()

            const ordderBody = ordderFactory.createValidOrdderBody(user.id)

            const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

            const body: any = {
                ...ordderBody, 
                itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: product.id }) ],
                paymentType:[]
            }

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

                const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                const body:newOrdderWithItensBody = {
                    ...ordderBody, 
                    itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: product.id }) ],
                    paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
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

                const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                const body:newOrdderWithItensBody = {
                    ...ordderBody, 
                    itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: product.id }) ],
                    paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                }

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.NOT_FOUND);
            })

            it("should respond with status 404 when product not exist", async () => {

                const token = await generateValidToken()

                const user = await userFactory.getFirstUser()

                const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                //const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                const body:newOrdderWithItensBody = {
                    ...ordderBody, 
                    itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: 99999999 }) ],
                    paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                }

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.NOT_FOUND);
            })

            it("should respond with status 404 when address not equal to client address", async () => {

                const token = await generateValidToken()

                const user = await userFactory.getFirstUser()

                const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                const secondClient = await clientFactory.createClient( await clientFactory.createClientBody())

                const secondAddress = await addressFactory.createAddress( await addressFactory.generateAddressValidBody(secondClient.id))

                ordderBody.addressId = secondAddress.id

                const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                const body:newOrdderWithItensBody = {
                    ...ordderBody, 
                    itens:[ await ordderFactory.createValidBodyItemWithoutOrdderId({ productId: product.id }) ],
                    paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                }

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                expect(response.status).toBe(httpStatus.NOT_FOUND);
            })

            it("should respond with status 404 when paymentType not exist", async () => {

                const token = await generateValidToken()

                const user = await userFactory.getFirstUser()

                const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                const productArray = []

                for (let i = 1; i <= 1; i++){

                    const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                    const ordderItem = await ordderFactory.createValidBodyItemWithoutOrdderId({productId: product.id})

                    productArray.push(ordderItem)
                }
                
                const body:newOrdderWithItensBody = {
                    ...ordderBody, 
                    itens: productArray,
                    paymentType:[ await paymentFactory.generatePaymentTypeValidBody(1)]
                }

                body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0);

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                const ordderData = await ordderFactory.getOrdderById(response.body.id)

                delete ordderData.deliveryStatus
                delete ordderData.createdAt
                delete ordderData.isValid
                delete ordderData.paymentStatus
                delete ordderData.updatedAt
                delete ordderData.ordderItem

                expect(response.body).toMatchObject(ordderData);

            })

            it("should respond with status 404 when payment value not equal to order value", async () => {

                const token = await generateValidToken()

                const user = await userFactory.getFirstUser()

                const ordderBody = await ordderFactory.createValidOrdderBody(user.id)

                const productArray = []

                for (let i = 1; i <= 1; i++){

                    const product = await productFactory.createProduct(await productFactory.generateProductValidBody())

                    const ordderItem = await ordderFactory.createValidBodyItemWithoutOrdderId({productId: product.id})

                    productArray.push(ordderItem)
                }

                const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                const body:newOrdderWithItensBody = {
                    ...ordderBody, 
                    itens: productArray,
                    paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                }

                body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) + 3737;

                const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                const ordderData = await ordderFactory.getOrdderById(response.body.id)

                delete ordderData.deliveryStatus
                delete ordderData.createdAt
                delete ordderData.isValid
                delete ordderData.paymentStatus
                delete ordderData.updatedAt
                delete ordderData.ordderItem

                expect(response.body).toMatchObject(ordderData);

            })

            describe("when body data is valid and have 1 ordderItem and 1 paymentType", () => {

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
                    
                    const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                    const body:newOrdderWithItensBody = {
                        ...ordderBody, 
                        itens: productArray,
                        paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                    }

                    body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0);

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
                    
                    const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                    const body:newOrdderWithItensBody = {
                        ...ordderBody, 
                        itens: productArray,
                        paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                    }

                    body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0);

                    const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)

                    const ordderData = await ordderFactory.getOrdderById(response.body.id)

                    delete ordderData.deliveryStatus
                    delete ordderData.createdAt
                    delete ordderData.isValid
                    delete ordderData.paymentStatus
                    delete ordderData.updatedAt
                    delete ordderData.ordderItem

                    expect(response.body).toMatchObject(ordderData);

                })

                describe("when body data is valid and have 2 ordderItem and 1 paymentType", () => {

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
                        
                        const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                        const body:newOrdderWithItensBody = {
                            ...ordderBody, 
                            itens: productArray,
                            paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                        }

                        body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0);
    
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
                        
                        const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                        const body:newOrdderWithItensBody = {
                            ...ordderBody, 
                            itens: productArray,
                            paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                        }

                        body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0);
    
                        const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)
    
                        const ordderData = await ordderFactory.getOrdderById(response.body.id)

                        delete ordderData.deliveryStatus
                        delete ordderData.createdAt
                        delete ordderData.isValid
                        delete ordderData.paymentStatus
                        delete ordderData.updatedAt
                        delete ordderData.ordderItem
    
                        expect(response.body).toMatchObject(ordderData);
    
                    })

                    describe("when body data is valid and have 15 ordderItem and 1 paymentType", () => {

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
                            
                            const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                            const body:newOrdderWithItensBody = {
                                ...ordderBody, 
                                itens: productArray,
                                paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                            }

                            body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0);
        
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
                            
                            const type = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                            const body:newOrdderWithItensBody = {
                                ...ordderBody, 
                                itens: productArray,
                                paymentType:[ await paymentFactory.generatePaymentTypeValidBody(type.id)]
                            }

                            body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0);
        
                            const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)
        
                            const ordderData = await ordderFactory.getOrdderById(response.body.id)

                            delete ordderData.deliveryStatus
                            delete ordderData.createdAt
                            delete ordderData.isValid
                            delete ordderData.paymentStatus
                            delete ordderData.updatedAt
                            delete ordderData.ordderItem
        
                            expect(response.body).toMatchObject(ordderData);
        
                        })
        
                    })

                    describe("when body data is valid and have 15 ordderItem and 5 paymentType", () => {

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
                            
                            const type1 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                            const type2 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                            const type3 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                            const type4 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                            const type5 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                            const body:newOrdderWithItensBody = {
                                ...ordderBody, 
                                itens: productArray,
                                paymentType:[ 
                                    await paymentFactory.generatePaymentTypeValidBody(type1.id),
                                    await paymentFactory.generatePaymentTypeValidBody(type2.id),
                                    await paymentFactory.generatePaymentTypeValidBody(type3.id),
                                    await paymentFactory.generatePaymentTypeValidBody(type4.id),
                                    await paymentFactory.generatePaymentTypeValidBody(type5.id)
                                ]
                            }

                            body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
                            body.paymentType[1].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
                            body.paymentType[2].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
                            body.paymentType[3].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
                            body.paymentType[4].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
        
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
                            
                            const type1 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                            const type2 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                            const type3 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                            const type4 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                            const type5 = await paymentTypeFactory.createPaymentType(await paymentTypeFactory.generatePaymentTypeValidBody())
                
                            const body:newOrdderWithItensBody = {
                                ...ordderBody, 
                                itens: productArray,
                                paymentType:[ 
                                    await paymentFactory.generatePaymentTypeValidBody(type1.id),
                                    await paymentFactory.generatePaymentTypeValidBody(type2.id),
                                    await paymentFactory.generatePaymentTypeValidBody(type3.id),
                                    await paymentFactory.generatePaymentTypeValidBody(type4.id),
                                    await paymentFactory.generatePaymentTypeValidBody(type5.id)
                                ]
                            }

                            body.paymentType[0].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
                            body.paymentType[1].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
                            body.paymentType[2].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
                            body.paymentType[3].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
                            body.paymentType[4].value = body.itens.reduce((total, num) => total + num.itemAmount * num.itemPrice, 0) / 5;
        
                            const response = await server.post("/ordder").set("Authorization", `Bearer ${token}`).send(body)
        
                            const ordderData = await ordderFactory.getOrdderById(response.body.id)

                            delete ordderData.deliveryStatus
                            delete ordderData.createdAt
                            delete ordderData.isValid
                            delete ordderData.paymentStatus
                            delete ordderData.updatedAt
                            delete ordderData.ordderItem
        
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

            expect(response.body).toMatchObject(ordderData);

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

                ordderData.map( e => {
                    e.ordderItem.map( e => {
                        delete e.createdAt
                        delete e.updatedAt
                    })
                    delete e.createdAt
                    delete e.updatedAt
                })
    
                const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
    
                expect(response.body).toMatchObject(ordderData);
    
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

                    ordderData.map( e => {
                        e.ordderItem.map( e => {
                            delete e.createdAt
                            delete e.updatedAt
                        })
                        delete e.createdAt
                        delete e.updatedAt
                    })    
        
                    const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
        
                    expect(response.body).toMatchObject(ordderData);
    
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

                ordderData.map( e => {
                    e.ordderItem.map( e => {
                        delete e.createdAt
                        delete e.updatedAt
                    })
                    delete e.createdAt
                    delete e.updatedAt
                })
    
                const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
    
                expect(response.body).toMatchObject(ordderData);
    
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

                    ordderData.map( e => {
                        e.ordderItem.map( e => {
                            delete e.createdAt
                            delete e.updatedAt
                        })
                        delete e.createdAt
                        delete e.updatedAt
                    })    
        
                    const response = await server.get("/ordder").set("Authorization", `Bearer ${token}`)
        
                    expect(response.body).toMatchObject(ordderData);
    
                })
            })
        })

    })
    
});
