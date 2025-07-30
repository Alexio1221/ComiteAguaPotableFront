// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aquí deberías consultar tu base de datos (ej: con fetch a tu backend)
        if (
          credentials?.email === "admin@comite.com" &&
          credentials?.password === "admin"
        ) {
          return { id: "1", name: "Admin", email: "admin@comite.com" };
        }

        return null; // Autenticación fallida
      },
    }),
  ],
  pages: {
    signIn: "/login", // Ruta personalizada
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
