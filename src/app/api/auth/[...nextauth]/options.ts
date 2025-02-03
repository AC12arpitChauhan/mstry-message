import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { throwDeprecation } from "process";
import { use } from "react";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          console.log("Credentials received:", credentials);
      
          // Validate credentials
          if (!credentials.identifier || !credentials.password) {
            throw new Error("Email/Username and password are required.");
          }
      
          // Find user by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
      
          console.log("User found:", user);
      
          if (!user) {
            throw new Error("No user found with this email/username.");
          }
      
          if (!user.isVerified) {
            console.log("User isVerified:", user.isVerified);
            throw new Error("Please verify your account before login.");
          }
          
      
          // Check if password matches
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
      
          if (isPasswordCorrect) {
            console.log("Authentication successful:", user);
            return user;
          } else {
            throw new Error("Incorrect password.");
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Error during authentication:", err.message);
          } else {
            console.error("An unknown error occurred.");
          }
        }
      }
      ,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified; // Ensure this is correctly set
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
          username: token.username,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
