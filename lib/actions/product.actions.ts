'use server'
import { PrismaClient } from "@prisma/client"
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
// Get Latest Products
export async function getLatestProducts() {
    const prisma = new PrismaClient();
    // Returns a prisma object, 
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: LATEST_PRODUCTS_LIMIT
    });

    // convert to plain js object before returning
    return convertToPlainObject(products);
}