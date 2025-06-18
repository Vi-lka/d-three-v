import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { type Provider } from "next-auth/providers";
import Yandex from "next-auth/providers/yandex";
import { env } from "@/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const providers: Provider[] = [
  Yandex({
    clientId: env.AUTH_YANDEX_ID,
    clientSecret: env.AUTH_YANDEX_SECRET,
    profile(profile) { 
      return { ...profile, name: profile.real_name, email: profile.default_email }
    }
  }),
  // Google({
  //   clientId: env.AUTH_GOOGLE_ID,
  //   clientSecret: env.AUTH_GOOGLE_SECRET,
  //   profile(profile) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  //     return { ...profile, id: profile.sub, emailVerified: profile.email_verified }
  //   }
  // }),
]

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})
.filter((provider) => provider.id !== "credentials")

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  secret: env.AUTH_SECRET,
  trustHost: true,
  providers,
  pages: {
    error: "/auth-error",
    signIn: "/sign-in",
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: env.NODE_ENV !== "production" ? true : false,
  callbacks: {
    session: ({ session, user }) => {
      return ({
        ...session,
        user: {
          id: user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
      })
    },
  },
} satisfies NextAuthConfig;
