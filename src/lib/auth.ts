import GoogleProvider from 'next-auth/providers/google';
import db from '@/db';

const clinet_id = process.env.GOOGLE_CLIENT_ID || '';
const client_secret = process.env.GOOGLE_CLIENT_SECRET || '';
const next_auth_secret = process.env.NEXT_AUTH_SECRET || 'asddipaksecrete';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: clinet_id,
      clientSecret: client_secret,
    }),
  ],

  secret: next_auth_secret,

  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile: any;
    }) {
      if (user.email && user.name && user.image && account?.access_token) {
        await db.user.upsert({
          where: {
            email: user.email,
          },
          update: {
            token: account.access_token,
          },
          create: {
            name: user.name,
            email: user.email,
            image: user.image,
            token: account.access_token,
          },
        });
      }

      return true;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session?.user?.email) {
        const dbUser = await db.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, name: true, email: true, image: true },
        });
        
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },

    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
};