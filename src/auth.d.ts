import type { Session } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      providerAccountId?: string | null;
    };
  }
}
