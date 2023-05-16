import { prisma } from "@/app/lib/prisma";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    newUser: "/",
    signIn: "/login",
  },
  callbacks: {
    signIn: async (user) => {
      return '/'
    },
  },
  providers: [
    CredentialsProvider({
      name: "Login",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (!user || !(await compare(credentials.password, user.encrypted_password))) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          name: user.username,
        };
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };