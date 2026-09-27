"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-ink/10 bg-sand">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-display text-xl">Tressly</p>
          <p className="mt-3 max-w-[32ch] text-sm text-ink/70">
            Hair accessories chosen with the same care you'd put in yourself — for everyday and every occasion.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li><Link href="/products?category=scrunchies">Scrunchies</Link></li>
            <li><Link href="/products?category=clips">Claw Clips</Link></li>
            <li><Link href="/products?category=clutchers">Clutchers</Link></li>
            <li><Link href="/products?category=headbands">Headbands</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-ink/70">
            <li><Link href="/blog">Journal</Link></li>
            <li><Link href="/dashboard/orders">Track an order</Link></li>
            <li><Link href="/login">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Stay in touch</p>
          <p className="mt-3 text-sm text-ink/70">Occasion reminders and early access to new drops. No spam.</p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full rounded-full border border-ink/15 bg-ivory px-4 py-2 text-sm outline-none focus:border-ink/40"
            />
            <button className="rounded-full bg-ink px-4 py-2 text-sm text-ivory">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-ink/10 py-5 text-center text-xs text-ink/50">
        © {new Date().getFullYear()} Tressly. All rights reserved.
      </div>
    </footer>
  );
}
