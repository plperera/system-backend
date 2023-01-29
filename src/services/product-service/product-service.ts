import { conflictError, notFoundError, requestError, unauthorizedError } from "@/errors"
import httpStatus from "http-status"
import { newClientBody } from "../../factories/clients-factory"
import clientRepository from "@/repositories/client-repository/client-repository"
import { newAddressBody } from "../../factories/address-factory"
import addressRepository from "@/repositories/address-repository/address-repository"
import { address } from "@prisma/client"
import { newProductBody } from "../../factories/products-factory"
import productRepository from "@/repositories/products-repository/products-repository"

async function createProduct(body: newProductBody){

    const hasProduct = await productRepository.findByNameOrCOD({name: body.name, COD: body.COD})

    if (hasProduct){
        throw conflictError()
    }

    const newProduct = await productRepository.createProduct(body)

    return newProduct
    
}

async function getAllProducts() {
    const allProducts = await productRepository.findAllProduct()
    return allProducts
}
const productService = {
    createProduct,
    getAllProducts
}

export default productService