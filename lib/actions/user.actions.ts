'use server'

import { isRedirectError } from "next/dist/client/components/redirect";
import { shippingAddressSchema, signInFormSchema, signUpFormSchema, paymentMethodSchema } from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { hash } from "../encrypt";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });
        

        await signIn('credentials', user);
        return { success: true, message: 'Signed in successfully' };

    } catch (error) {
        
        if(isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: 'Invalid email or password' };
    }
}

// Sign user out
export async function signOutUser() {
    await signOut();
}

// Sign up User
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        });
        
        const plainPassword = user.password;
        user.password = await hash(user.password);

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            },
        });

        await signIn('credentials', {
            email: user.email,
            password: plainPassword,
        });

        return { success: true, message: 'User registered successfully'};
    } catch (error) {
        //console.log(error.name);
        //console.log(error.code);
        //console.log(error.errors);
        //console.log(error.meta?.target);
        if(isRedirectError(error)) {
            throw error;
        }
        return { success: false, message: formatError(error) };
    }
}

// Get a user by the ID
export async function getUserById(userId: string) {
    const user = await prisma.user.findFirst({
        where: { id: userId }
    });
    if (!user) throw new Error('User not found');
    return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: {id: session?.user?.id },
        });

        if(!currentUser) throw new Error('User not found');

        const address = shippingAddressSchema.parse(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { address }
        });

        return {
            success: true,
            messages: 'User updated successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}

// Update the user's payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });

        if(!currentUser) throw new Error('User not found');

        const paymentMethod = paymentMethodSchema.parse(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type }
        });

        return {
            success: true,
            messages: 'Payment method updated successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }

}

// Update the user profile
export async function updateProfile(user: { name: string; email: string}) {
 try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
        where: {
            id: session?.user?.id
        }
    });

    if(!currentUser) throw new Error('User Not Found');

    await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            name: user.name
        }
    });

    return {
        success: true,
        message: 'User updated successfully.'
    }

 } catch (error) {
    return {
        success: false,
        messages: formatError(error)
    }
 }
}