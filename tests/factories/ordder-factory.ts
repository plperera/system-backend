import bcrypt from "bcrypt";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { users } from ".prisma/client";
import { signUpBody } from "./auth-factory";
import productFactory from "./products-factory";
import clientFactory from "./clients-factory";
import addressFactory from "./address-factory";

export type newItemBody = {
    ordderId: number,
    productId: number,
    itemAmount: number,
    itemPrice: number
}

export type newOrdderBody = {
    userId: number,
    clientId: number,
    addressId: number
}

export type fullOrdderBody = {
    userId: number,
    numberOfItens: number
}

async function createValidOrdderBody(userId: number) {

    const client = await clientFactory.createClient(await clientFactory.createClientBody())

    const address = await addressFactory.createAddress(await addressFactory.generateAddressValidBody(client.id))

    return {
        userId,
        clientId:client.id,
        addressId:address.id
    }
}

async function createValidOrdder(body: newOrdderBody) {
    return prisma.ordder.create({
        data:{
            userId: body.userId,
            clientId: body.clientId,
            addressId: body.addressId,
        }
    })
}

async function createValidBodyItem(body: { ordderId: number, productId: number}) {
    return{
        ordderId: body.ordderId,
        productId: body.productId,
        itemAmount: Number(faker.random.numeric(2)) * 10,
        itemPrice: Number(faker.random.numeric(2)) * 10,
    }
}

async function createValidBodyItemWithoutOrdderId(body: { productId: number}) {
    return{
        productId: body.productId,
        itemAmount: Number(faker.random.numeric(2)) * 10,
        itemPrice: Number(faker.random.numeric(2)) * 10,
    }
}

async function createValidItem(body: newItemBody) {
    return prisma.ordderItem.create({
        data:{
            ordderId: body.ordderId,
            productId: body.productId,
            itemAmount: body.itemAmount,
            itemPrice: body.itemPrice,
        }
    })
}

async function createFullOrdder(body: fullOrdderBody) {

    const ordder = await ordderFactory.createValidOrdder(await ordderFactory.createValidOrdderBody(body.userId))

    const productIdArray: any = []

    for (let i = body.numberOfItens; i !== 0; i--){

        const newProduct = await productFactory.createProduct(await productFactory.generateProductValidBody())
        productIdArray.push( newProduct.id )

    }

    productIdArray.map(async (e: number) => await ordderFactory.createValidBodyItem({ordderId: ordder.id, productId: e}))

    return prisma.ordderItem.createMany({
        data:[productIdArray]
    })
    
}

async function getOrdderById(ordderId: number) {
    return prisma.ordder.findFirst({
        where:{
            id: ordderId
        },
        include: {
            ordderItem: true
        }
    })
}

async function getAllOrdders(){
    return prisma.ordder.findMany()
}


const ordderFactory = {
    createValidOrdderBody,
    createValidOrdder,
    createValidBodyItem,
    createValidItem,
    createFullOrdder,
    createValidBodyItemWithoutOrdderId,
    getOrdderById,
    getAllOrdders
}

export default ordderFactory