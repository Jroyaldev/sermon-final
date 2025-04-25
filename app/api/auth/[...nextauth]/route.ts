import NextAuth, { DefaultSession, User, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // Commented out adapter import
import clientPromise from "@/lib/mongodb";
// import GoogleProvider from "next-auth/providers/google"; // Commented out
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

// Augment the Session type to include the user ID
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}

// Augment the JWT type if needed (e.g., if you add more properties in the jwt callback)
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

// For any production deployment, you MUST set the NEXTAUTH_SECRET environment variable!
// See https://next-auth.js.org/configuration/options#secret
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("\x1b[33m%s\x1b[0m", "[WARN] NEXTAUTH_SECRET is not set. Using default value for development.");
}

// Comment out or remove Google credential check
// if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
//   console.warn("\x1b[33m%s\x1b[0m", "[WARN] Google OAuth Provider credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are not set. Google login will not work.");
// }

// Define AuthOptions
export const authOptions: NextAuthOptions = {
  // Commented out the adapter usage
  // adapter: MongoDBAdapter(clientPromise, {
  //   databaseName: "sermon_flow_app",
  // }),
  providers: [
    // Commented out GoogleProvider
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) {
          console.error("Missing credentials");
          return null;
        }

        const client: MongoClient = await clientPromise;
        // Make sure database name is consistent
        const db = client.db("sermon_flow_app"); 
        // Ensure collection name is correct
        const usersCollection = db.collection("users"); 

        try {
          // Fetch user explicitly checking for null
          const user = await usersCollection.findOne<{ _id: import('mongodb').ObjectId, email?: string, name?: string, hashedPassword?: string }>({ email: credentials.email });

          if (!user) {
            console.log("No user found with email:", credentials.email);
            return null; // User not found
          }

          // Check for hashedPassword field existence
          if (!user.hashedPassword) {
             console.error("User object in DB is missing hashedPassword field");
             return null; 
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

          if (!passwordMatch) {
            console.log("Password mismatch for user:", credentials.email);
            return null; // Passwords don't match
          }

          console.log("Credentials authorized for user:", credentials.email);
          // Return the user object expected by NextAuth
          return {
            id: user._id.toString(), 
            email: user.email ?? '', // Provide default if email is potentially null/undefined
            name: user.name, // Optional: Provide default if needed
          } as User;

        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        } finally {
          // Avoid closing the client here if it's managed globally by clientPromise
          // await client.close(); 
        }
      }
    })
  ],
  session: {
    // Use JSON Web Tokens for session handling
    strategy: "jwt",
  },
  // Add callbacks here if you need to customize behavior (e.g., modify JWT, session)
  callbacks: {
    // Example: Include user ID in the session token (JWT)
    async jwt({ token, user }) {
      // Ensure user object exists and has id
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    // Example: Make user ID available in the session object client-side
    async session({ session, token }) {
      // Ensure session.user and token.id exist
      if (session?.user && token?.id) {
         session.user.id = token.id as string;
      }
      return session;
    },
  },
  // If you need custom pages for sign-in, sign-out, error, etc.
  pages: {
    signIn: '/auth/signin', // Optional: Redirect to a custom sign-in page
    // error: '/auth/error', // Optional: Redirect to a custom error page
  },
  secret: process.env.NEXTAUTH_SECRET, // Crucial for production!
  // You might need to add debug: true here temporarily if issues persist
  // debug: process.env.NODE_ENV === 'development',
};

// Initialize NextAuth with the options
const handler = NextAuth(authOptions);

// Export the handlers
export { handler as GET, handler as POST }; 