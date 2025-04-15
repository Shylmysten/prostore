'use server';

import { z } from "zod";
import { insertReviewSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// Create & Update Reviews
export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {
    try {
        const session = await auth();

        if(!session) throw new Error("User is not authenticated");

        // Validate and store the review
        const review = insertReviewSchema.parse({
            ...data,
            userId: session?.user?.id,
        });

        // Get product that is being reviewed
        const product = await prisma.product.findFirst({
            where: { id: review.productId }
        });

        if(!product) throw new Error('Product not found');

        // Check if user already reviewed this product
        const reviewExists = await prisma.review.findFirst({
            where: { 
                productId: review.productId,
                userId: review.userId,
            }
        });

        await prisma.$transaction(async (tx) => {
            if(reviewExists) {
                //update review
                await tx.review.update({
                    where: { id: reviewExists.id },
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating,
                    },
                });
            } else {
                // create review
                await tx.review.create({ data: review });
            }

            // Get the Avg rating
            const averageRating = await tx.review.aggregate({
                _avg: { rating: true },
                where: { productId: review.productId },
            });

            // Get Number of reviews
            const numReviews = await tx.review.count({
                where: { productId: review.productId },
            });

            // Update the Rating and numReviews in the product table
            await tx.product.update({
                where: { id: review.productId },
                data: {
                    rating: averageRating._avg.rating || 0,
                    numReviews,
                },
            });
        });

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: "Review Updated Successfully",
        };

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        };
    }
}