export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Prostore is a modern e-commerce platform built with Next.js.';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 4;
export const signInDefaultValues = {
    email: '',
    password: '',
}
export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
}

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: ''
}

export const PAYEMENT_METHODS = process.env.PAYEMENT_METHODS ? process.env.PAYEMENT_METHODS.split(',') : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYEMENT_METHOD = process.env.DEFAULT_PAYEMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
    name: '',
    slug: '',
    category: '',
    images: [],
    brand: '',
    description: '',
    price: '0',
    stock: 0,
    rating: '0',
    numReviews: '0',
    isFeatured: false,
    banner: null,
}

export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(', ') : ['admin', 'user'];

export const reviewFormDefaultValues = {
    title: '',
    comment: '',
    rating: 0,
}

export const SENDER_EMAIL = process.env.SENDER_EMIAIL || 'onboarding@resend.dev'