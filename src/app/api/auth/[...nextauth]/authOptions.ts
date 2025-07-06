import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/connectDB";
import { userModel } from "@/models/user";
import bcrypt from "bcryptjs";
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await userModel.findOne({ email: credentials?.email });

        if (!user) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  jwt:{
       maxAge: 60 * 60 * 24 * 7,
  },
 callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.user = {
        id:user.id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 include this!
      };
    }
    return token;
  },
  async session({ session, token }) {
      if(token.user){
          session.user = token.user;
      }
    return session;
  }
},
  secret: process.env.NEXTAUTH_SECRET,
};
