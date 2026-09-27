"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/context/cartStore";
import { useWishlistStore } from "@/context/wishlistStore";
import { useAuth } from "@/context/AuthContext";
import SearchOffcanvas from "./SearchOffcanvas";
import WishlistOffcanvas from "./WishlistOffcanvas";

const NAV = [
  { label: "Scrunchies", href: "/products?category=scrunchies" },
  { label: "Claw Clips", href: "/products?category=clips" },
  { label: "Clutchers", href: "/products?category=clutchers" },
  { label: "Headbands", href: "/products?category=headbands" },
  { label: "Hair Pins", href: "/products?category=hair-pins" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user } = useAuth();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <button className="p-2 md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>

        <Link href="/" className="font-display text-2xl tracking-tight">
          Tressly
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="link-underline text-[15px]">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button className="p-2" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={20} />
          </button>
          <Link href={user ? "/dashboard" : "/login"} className="p-2" aria-label="Account">
            <User size={20} />
          </Link>
          <button className="relative p-2" aria-label="Wishlist" onClick={() => setWishlistOpen(true)}>
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-berry text-[10px] text-ivory">
                {wishlistCount}
              </span>
            )}
          </button>
          <Link href="/cart" className="relative p-2" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-berry text-[10px] text-ivory">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-ivory md:hidden">
          <div className="container-page flex h-16 items-center justify-between">
            <span className="font-display text-2xl">Tressly</span>
            <button className="p-2" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <nav className="container-page flex flex-col gap-1 pt-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-ink/10 py-4 text-lg"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <SearchOffcanvas open={searchOpen} onClose={() => setSearchOpen(false)} />
      <WishlistOffcanvas open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </header>
  );
}
