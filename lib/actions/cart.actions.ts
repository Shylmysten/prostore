'use server'
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

// Calculate Cart prices
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    }
}

export async function addItemToCart(data: CartItem) {
    try {
        // Check for the cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) {
            throw new Error('Cart session not found');
        }

        // Get session and user ID
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        // Get Cart
        const cart = await getMyCart();

        // Parse and validate Item
        const item = cartItemSchema.parse(data);

        // Find Product in Database
        const product = await prisma.product.findFirst({
            where: { id: item.productId }
        })

        if(!product) throw new Error('Product not found');

        if(!cart) {
            // create new cart object
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                sessionCartId: sessionCartId,
                ...calcPrice([item]),
            });
            
            // Add to database
            await prisma.cart.create({
                data: newCart,
            });

            // Revalidate product page
            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: 'Item added to cart',
            };
        } else {
            
        }

        // TESTING
        //console.log({
        //    'Session Cart ID': sessionCartId,
        //    'User ID': userId,
        //    'Item Requested': item,
        //    'Product Found': product,
        //})
        

    } catch (error) {
        return {
            success: true,
            message: formatError(error),
        };
    }

}

export async function getMyCart() {
    // Check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) {
        throw new Error('Cart session not found');
    }

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart from database using session id
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId : sessionCartId }
    });

    if(!cart) return undefined;

    // Convert decimals and return
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.itemsPrice.toString(),
        shippingPrice: cart.itemsPrice.toString(),
        taxPrice: cart.itemsPrice.toString(),
    })
}