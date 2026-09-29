"use client";

import Link from "next/link";
import { ReactNode } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

// Client-side gate. It uses the same /api/auth/me check the header uses, so
// "logged in" here always matches what the rest of the UI shows. The real
// security lives in the API routes (they verify the cookie / admin role).
export default function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="container-page py-24 text-center text-ink/60">Loading…</p>;
  }

  if (!user || (admin && user.role !== "admin")) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-ink/70">
          {admin && user ? "You don't have access to this page." : "Please sign in to continue."}
        </p>
        {!user && (
          <Link href="/login" className="mt-6 inline-block">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
