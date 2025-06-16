# Prostore

Prostore is a modern eCommerce platform built with [Next.js](https://nextjs.org/) and [React 19](https://react.dev/). It uses serverless technologies, PostgreSQL, and a modular component architecture. The codebase is designed for scalability and maintainability.

## View a Demo

See a live demo at [https://prostore-plum.vercel.app/](https://prostore-plum.vercel.app/)

## Techniques Used

- [Server Components and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) for optimized rendering and data fetching.
- [React Context](https://react.dev/reference/react/createContext) for theme and state management.
- [React Hook Form](https://react-hook-form.com/) for performant, accessible forms.
- [Zod](https://zod.dev/) for schema validation.
- [Dynamic Routing](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) with file-based routes.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- [ShadCN UI](https://ui.shadcn.com/) for accessible, customizable UI primitives.
- [Next Auth](https://next-auth.js.org/) for authentication.
- [Prisma ORM](https://www.prisma.io/) for type-safe database access.
- [PayPal](https://developer.paypal.com/docs/api/overview/) and [Stripe](https://stripe.com/docs/api) integrations for payments.
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for efficient scroll-based UI updates.
- [Google Fonts: Inter](https://fonts.google.com/specimen/Inter) via Next.js font optimization.

## Notable Libraries and Technologies

- [@neondatabase/serverless](https://neon.tech/docs/serverless/) for PostgreSQL over WebSockets.
- [@prisma/adapter-neon](https://www.prisma.io/docs/orm/prisma-client/adapter-neon) for Prisma + Neon integration.
- [lucide-react](https://lucide.dev/) for SVG icon components.
- [uploadthing](https://docs.uploadthing.com/) for file uploads.
- [Recharts](https://recharts.org/en-US/) for data visualization.
- [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode support.

## Project Structure

```
app/
assets/
components/
db/
hooks/
lib/
prisma/
public/
types/
```

- `app/`: Next.js app directory, including routing and page components.
- `assets/`: Static assets such as images and global styles.
- `components/`: Reusable UI and layout components.
- `db/`: Database utilities and configuration.
- `hooks/`: Custom React hooks.
- `lib/`: Shared utilities, constants, and API logic.
- `prisma/`: Prisma schema and migration files.
- `public/`: Publicly served static files.
- `types/`: TypeScript type definitions.

## Setup and Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd prostore
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up your environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values for your database, authentication, and third-party services.

4. **Initialize the database:**
   - Set up a [Neon](https://neon.tech/) PostgreSQL database.
   - Run:
     ```sh
     npx prisma migrate deploy
     ```

5. **Run the development server:**
   ```sh
   npm run dev
   ```

6. **Build and start for production:**
   ```sh
   npm run build
   npm start
   ```