'use server'
//import { PrismaClient } from "@prisma/client"
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
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

// Delete a Product
export async function deleteProduct( id: string ) {
    try {
        const productExists = await prisma.product.findFirst({
            where: { id }
        });

        if(!productExists) throw new Error('Product not found');

        await prisma.product.delete({ where: { id }});

        revalidatePath('/admin/products');

        return { success: true, message: 'Product deleted successfully'};
    } catch (error) {
        return { success: false, message: formatError(error)};
    }
}