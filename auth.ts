import { compare } from './lib/encrypt';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        strategy: 'jwt',
        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' },
            },
            // Credentials is an object from the data that comes from our signIn form
            async authorize(credentials) {
                if(credentials == null) return null;

                // Find user in database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                });

                // Check if user exists and if the password matches
                if(user && user.password) {
                    const isMatch = await compare(credentials.password as string, user.password);

                    // If password is correct, return user
                    if(isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }
                // If user does not exist or password does not match return null
                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            // set the user ID from the token
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;
            
            //console.log(token);

            // if there is an update, set the user name
            if(trigger === 'update') {
                session.user.name = user.name;
            }

            return session
        },
        async jwt({ token, user, trigger, session }: any) {
            // Assign user fields to the token
            if(user) {
                token.id = user.id;
                token.role = user.role;

                // if user has no name then use the email
                if(user.name === 'NO_NAME') {
                    token.name = user.email!.split('@')[0];

                    //update the database to reflect the token name
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name },
                    });
                }

                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObject = await cookies();
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value;

                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId  },
                        });

                        if(sessionCart) {
                            // Delete Current user cart
                            await prisma.cart.deleteMany({
                                where: { userId: user.id },
                            });

                            // Assign new Cart
                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: { userId: user.id },
                            })
                        }
                    }
                }
            }

            // handle session updates
            if (session?.user.name && trigger === 'update') {
                token.name = session.user.name;
            }
            return token;
        },
        authorized({ request, auth }: any) {
            // Create an Array of regex patterns of paths we want to protect if user is not logged in
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];

            // Get the pathname from the request URL object
            const { pathname } = request.nextURL;

            // Check if user is not authenticated and if the path is protected
            if(!auth?.user && protectedPaths.some((path) => path.test(pathname))) {
                return false;
            }

            // check for session cart cookie
            if(!request.cookies.get('sessionCartId')) {
                // Generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();

                // clone the request headers
                const newRequestHeaders = new Headers(request.headers);

                // create new response and add the new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders
                    }
                });

                // Set newly generated sessionCartId in the response cookies
                response.cookies.set('sessionCartId', sessionCartId);
                return response;
            } else {
                return true;
            }
        }
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);