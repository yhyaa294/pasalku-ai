// import type { NextAuthConfig } from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import type { User, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export const authConfig = {
  providers: [
    // GitHubProvider({                            
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),
    // GoogleProvider({                            
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              username: credentials.email as string,
              password: credentials.password as string,
            }),
          });

          if (response.ok) {
            const data = await response.json(); // Expects { access_token: '...', user: { ... } }
            if (data && data.access_token && data.user) {
              return {
                id: data.user.email, // Or data.user.id if available
                email: data.user.email,
                name: data.user.name || data.user.email.split('@')[0],
                role: data.user.role,
                accessToken: data.access_token,
              };
            }
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }: { auth: Session | null; request: any }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
                           nextUrl.pathname.startsWith('/chat');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/chat', nextUrl));
      }
      return true;
    },
  },  pages: {
    signIn: '/login',
    error: '/login',
  },
};
