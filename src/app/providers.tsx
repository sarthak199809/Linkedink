"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider basePath="/Linkedink/api/auth">{children}</SessionProvider>;
}
