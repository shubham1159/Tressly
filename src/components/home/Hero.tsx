"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="container-page grid gap-8 pt-8 sm:pt-14 md:grid-cols-2 md:items-center md:gap-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-sm tracking-wide text-berry">For everyday and every occasion</p>
        <h1 className="mt-3 max-w-[14ch] font-display text-4xl leading-[1.08] sm:text-6xl">
          Hair accessories worth keeping.
        </h1>
        <p className="mt-5 max-w-[42ch] text-ink/70">
          Scrunchies, claw clips, clutchers and pins — made to hold up on busy days and look good doing it.
          Delivered across India.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/products" className="rounded-full bg-ink px-7 py-3 text-sm text-ivory hover:bg-berry">
            Shop the edit
          </Link>
          <Link href="/occasions/bridal" className="rounded-full border border-ink/20 px-7 py-3 text-sm hover:border-ink">
            Shop by look
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand md:aspect-[5/4]"
      >
        <Image
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200"
          alt="A curated set of hair accessories"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}
