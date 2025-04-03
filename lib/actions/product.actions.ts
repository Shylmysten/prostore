'use server'
//import { PrismaClient } from "@prisma/client"
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
// Get Latest Products
export async function getLatestProducts() {
    //const prisma = new PrismaClient();
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

// Get Product by it's slug
export async function getProductBySlug(slug: string) {
    //const prisma = new PrismaClient();
    const product = await prisma.product.findFirst({
        where: {
            slug: slug
        }
    });

    return convertToPlainObject(product);
}

// Get all products
export async function getAllProducts({
    query,
    limit = PAGE_SIZE,
    page,
    category
}: {
    query: string;
    limit?: number;
    page: number;
    category?: string
}) {
    const data = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit
    });

    const dataCount = await prisma.product.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}