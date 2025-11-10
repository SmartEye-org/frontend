"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-provider";
import { QueryProvider } from "@/lib/query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
