'use server'
import { insertProductSchema, updateProductSchema } from './../validators';
//import { PrismaClient } from "@prisma/client"
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import { Prisma } from '@prisma/client';
// Get Latest Products
export async function getLatestProducts() {
  
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

// Get single Product by it's slug
export async function getProductBySlug(slug: string) {
   
    const product = await prisma.product.findFirst({
        where: {
            slug: slug
        }
    });

    return convertToPlainObject(product);
}

// Get single Product by it's ID
export async function getProductByID(productId: string) {
   
    const data = await prisma.product.findFirst({
        where: {
            id: productId
        }
    });

    return convertToPlainObject(data);
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
    // Query filter
    const queryFilter: Prisma.ProductWhereInput =
        query && query !== 'all'
        ? {
            name: {
            contains: query,
            mode: 'insensitive',
            } as Prisma.StringFilter,
        }
        : {};

    const data = await prisma.product.findMany({
        where: {
            ...queryFilter,
        },
        orderBy: {createdAt: 'desc'},
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

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
        const product = insertProductSchema.parse(data);
        await prisma.product.create({data: product});

        revalidatePath('/admin/products');

        return { success: true, message: 'Product created successfully'};
    } catch (error) {
        return { success: false, message: formatError(error)};
    }
}
// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
        const product = updateProductSchema.parse(data);
        const productExists = await prisma.product.findFirst({
            where: { id: product.id }
        });

        if(!productExists) throw new Error('Product not found');

        await prisma.product.update({
            where: { id: product.id },
            data: product
        });

        revalidatePath('/admin/products');

        return { success: true, message: 'Product updated successfully'};
    } catch (error) {
        return { success: false, message: formatError(error)};
    }
}