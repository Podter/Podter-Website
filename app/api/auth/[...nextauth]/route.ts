import NextAuth, { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/lib/prismadb";

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const guestbookMessage = await prisma.guestbookMessage.findFirst({
        where: {
          email: user.email || "",
        },
        select: {
          providerAccountId: true,
        },
      });

      if (guestbookMessage) {
        if (guestbookMessage.providerAccountId !== account?.providerAccountId) {
          return "/api/auth/signin?error=OAuthAccountNotLinked";
        }
      }

      return true;
    },
    async session({ session, token }) {
      session.user.providerAccountId = token.sub;
      return session;
    },
  },
  theme: {
    colorScheme: "auto",
    brandColor: "#d20f39",
    buttonText: "#ffffff",
    logo: "/logo.svg",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };