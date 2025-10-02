import { getServerSession } from "next-auth/next"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/backend/lib/prisma"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.id = user.id;
        
        if (account?.provider === 'google') {
          token.role = 'NUTRITIONIST';
        } else if (!user.role && user.email) {
          const dbUser = await prisma.user.findUnique({ 
            where: { email: user.email },
            select: { role: true, isPro: true, subscriptionStatus: true }
          });
          token.role = dbUser?.role || 'CLIENT';
          token.isPro = dbUser?.isPro || false;
          token.subscriptionStatus = dbUser?.subscriptionStatus;
        } else {
          token.role = (user as any).role;
          token.isPro = (user as any).isPro || false;
          token.subscriptionStatus = (user as any).subscriptionStatus;
        }
      }
      
      if (token.id && token.role === 'NUTRITIONIST') {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isPro: true, subscriptionStatus: true }
        });
        if (dbUser) {
          token.isPro = dbUser.isPro;
          token.subscriptionStatus = dbUser.subscriptionStatus;
        }
      }
      
      return token;
    },
    session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as any).isPro = token.isPro;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
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