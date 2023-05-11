'use client'
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import setCookie from 'cookies-next'
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch("http://localhost:4000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orgNumber: credentials?.username,
            password: credentials?.password,
          }),
        });
        const user = await res.json();
        console.log("useraccess", user);
        if (user) {

          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      console.log("session::::", token);


      session.user = token;
      return session;
    },

  },
  pages: {
    signIn: "/login",

  },
  jwt: {
    secret: "test123",
  },
});
