import { NextAuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Se o usuário está logando via Google, buscar no banco o role
      if (user) {
        token.id = user.id;
        // Buscar role do usuário no banco se não estiver presente
        if (account?.provider === 'google') {
          token.role = 'NUTRITIONIST'; // Temporary: Always assign 'NUTRITIONIST' for Google logins
        } else if (!user.role && user.email) {
          const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
          token.role = dbUser?.role || 'CLIENT';
        } else {
          token.role = (user as any).role;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to the dashboard after successful login
      return baseUrl + '/dashboard';
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  }
}

export const getAuthSession = () => getServerSession(authOptions);