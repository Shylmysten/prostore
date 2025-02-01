'use server'

import { isRedirectError } from "next/dist/client/components/redirect";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";


// Create Order and create the order items
export async function createOrder() {
    try {
        const session = await auth();

        if(!session) throw new Error('User is not authenticated');

        const cart = await getMyCart();
        const userId = session?.user?.id;
        if(!userId) throw new Error('User not found');

        const user = await getUserById(userId);

        if(!cart || cart.items.length === 0) {
            return {
                success: false,
                message: 'Your cart is empty',
                redirectTo: '/cart',
            }
        }
        if(!user.address) {
            return {
                success: false,
                message: 'No Shipping Address found',
                redirectTo: '/shipping-address',
            }
        }
        if(!user.paymentMethod) {
            return {
                success: false,
                message: 'No payment method found',
                redirectTo: '/payment-method',
            }
        }

        // Create order object
        const order = insertOrderSchema.parse({
            userId: userId,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });

        // reference https://www.prisma.io/docs/orm/prisma-client/queries/transactions
        // A database transaction refers to a sequence of read/write operations that are guaranteed to either succeed or fail as a whole. Transactions are a way to ensure that a sequence of operations are all completed successfully, or none of them are. This is useful when you need to make sure that a set of operations are all completed successfully before you proceed to the next step.
        
        // Create a transaction to insert the order and order items
        const insertedOrderId = await prisma.$transaction(async(tx) => {
            // Create Order
            const insertedOrder = await tx.order.create({ data: order });
            // Create Order Items from the cart items
            for(const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id,
                    }
                })
            }
            // Clear the cart
            await tx.cart.update({ 
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0,
                },
            });

            return insertedOrder.id;
        });

        if(!insertedOrderId) throw new Error('Order not created');

        return {
            success: true,
            message: 'Order created successfully',
            redirectTo: `/order/${insertedOrderId}`,
        }
        
    } catch (error) {
        if(isRedirectError(error)) throw error;
        return {
            success: false,
            message: formatError(error),
        }
    }
}

// Get Order by Id
export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: { 
            id: orderId 
        },
        include: { 
            orderitems: true,
            user: { 
                select: { 
                    email: true,
                    name: true,
                } 
            },
        },
    });

    return convertToPlainObject(data);
}