import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, deviceAuthorization } from "better-auth/plugins";
import { personService } from "../services/person.service.js";
import { prisma } from "./db.js";

export const TV_CLIENT_ID = "couchduck-tv";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: (user) => personService.createDefault(user),
      },
    },
  },
  socialProviders: {
    google: {
      enabled: Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET),
      clientId: GOOGLE_CLIENT_ID ?? "",
      clientSecret: GOOGLE_CLIENT_SECRET ?? "",
    },
  },
  plugins: [
    deviceAuthorization({
      verificationUri: "/device",
      validateClient: (clientId) => clientId === TV_CLIENT_ID,
    }),
    bearer(),
  ],
});
