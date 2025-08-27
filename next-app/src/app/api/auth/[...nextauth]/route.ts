import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { env } from '@/env';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID ?? '',
      clientSecret: env.GITHUB_SECRET ?? '',
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  session: { strategy: 'jwt' },
  secret: env.NEXTAUTH_SECRET,
  pages: {},
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        (session as any).userId = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

