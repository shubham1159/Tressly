"use client";

import { useAuth } from "@/context/AuthContext";
import { useWishlistStore } from "@/context/wishlistStore";
import Link from "next/link";
import { Package, Heart, LogOut, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  if (!user) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-ink/70">Please sign in to view your account.</p>
        <Link href="/login" className="mt-6 inline-block">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="container-page py-10">
      {/* Profile header */}
      <div className="flex flex-col items-start gap-5 rounded-3xl bg-sand p-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-berry font-display text-xl text-ivory">
            {initials}
          </div>
          <div>
            <h1 className="font-display text-2xl">{user.name}</h1>
            <p className="mt-0.5 text-sm text-ink/60">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-full border border-ink/15 bg-ivory px-4 py-2 text-sm hover:border-ink/40"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/orders"
          className="group flex items-center justify-between rounded-2xl border border-ink/10 p-6 transition-colors hover:border-ink/30"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sand">
              <Package size={18} />
            </div>
            <div>
              <p className="font-medium">Orders</p>
              <p className="mt-0.5 text-sm text-ink/60">Track and review past orders</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink/30 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/wishlist"
          className="group flex items-center justify-between rounded-2xl border border-ink/10 p-6 transition-colors hover:border-ink/30"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sand">
              <Heart size={18} />
            </div>
            <div>
              <p className="font-medium">Wishlist</p>
              <p className="mt-0.5 text-sm text-ink/60">
                {wishlistCount > 0 ? `${wishlistCount} item${wishlistCount > 1 ? "s" : ""} saved` : "Items you've saved"}
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-ink/30 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
