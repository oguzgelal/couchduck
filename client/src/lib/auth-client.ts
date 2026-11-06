import { createAuthClient } from "better-auth/react";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import { sessionStore } from "./session-store";

export const TV_CLIENT_ID = "couchduck-tv";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  plugins: [deviceAuthorizationClient()],
  fetchOptions: {
    auth: {
      type: "Bearer",
      token: () => sessionStore.getToken() ?? undefined,
    },
  },
});
