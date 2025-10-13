import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          console.log("Credentials received:", credentials);

          if (!credentials?.identifier || !credentials?.password) {
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
            throw new Error("Please verify your account before login.");
          }

          // ✅ Handle Google sign-in users (no password set)
          if (!user.password) {
            throw new Error(
              "This account was created using Google Sign-In. Please log in with Google instead."
            );
          }

          // ✅ Ensure password provided
          if (!credentials.password) {
            throw new Error("Password is required.");
          }

          // ✅ Compare password safely
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid password.");
          }

          console.log("Authentication successful:", user);
          return user;
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Error during authentication:", err.message);
            throw new Error(err.message);
          } else {
            console.error("An unknown error occurred.");
            throw new Error("Authentication failed.");
          }
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();

        const rawName = profile?.name || "user";
        const username = rawName
          .toLowerCase()
          .replace(/\s+/g, "") // remove spaces
          .replace(/[^a-z0-9]/g, ""); // remove invalid chars

        const email = profile?.email;

        let existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
          existingUser = await UserModel.create({
            username,
            email,
            isVerified: true,
            password: null, // No password for Google users
            isAcceptingMessage: true,
            messages: [],
          });
        } else if (!existingUser.username) {
          existingUser.username = username;
          await existingUser.save();
        }

        // Attach user data for callbacks
        user._id = (existingUser._id as any).toString();
        user.username = existingUser.username;
        user.isVerified = existingUser.isVerified;
        user.isAcceptingMessages = existingUser.isAcceptingMessage;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          username: token.username,
          isVerified: token.isVerified,
          isAcceptingMessages: token.isAcceptingMessages,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
