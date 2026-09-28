"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const SLIDES = [
  {
    eyebrow: "For everyday and every occasion",
    title: "Hair accessories worth keeping.",
    text: "Scrunchies, claw clips, clutchers and pins — made to hold up on busy days and look good doing it.",
image: "/images/xhiet_512.jpg",
    alt: "A curated set of hair accessories",
    primaryHref: "/products",
    primaryLabel: "Shop the edit",
    secondaryHref: "/occasions/bridal",
    secondaryLabel: "Shop by look",
  },
  {
    eyebrow: "New in",
    title: "Silk scrunchies, freshly restocked.",
    text: "Pure mulberry silk that's kind to your strands — no creases, no snags, all-day hold.",
    image: "/images/TulipScrunchy.jpeg",
    alt: "Silk scrunchies in soft colours",
    primaryHref: "/products?category=scrunchies",
    primaryLabel: "Shop scrunchies",
    secondaryHref: "/products",
    secondaryLabel: "View all",
  },
  {
    eyebrow: "Wedding season edit",
    title: "Pins and vines for your big day.",
    text: "Handcrafted crystal and pearl pieces for updos, half-ups, and everything in between.",
    image: "/images/vha1s_512.jpg",
    alt: "Bridal hair pins and crystal vine",
    primaryHref: "/occasions/bridal",
    primaryLabel: "Shop bridal",
    secondaryHref: "/products?category=hair-pins",
    secondaryLabel: "Shop hair pins",
  },
];

export default function Hero() {
  return (
    <section className="container-page pt-8 sm:pt-14">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        loop
        speed={700}
        className="hero-swiper overflow-hidden rounded-3xl"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="grid gap-8 bg-sand p-6 sm:p-10 md:grid-cols-2 md:items-center md:gap-4 md:p-12">
              <div>
                <p className="text-sm tracking-wide text-berry">{slide.eyebrow}</p>
                <h1 className="mt-3 max-w-[14ch] font-display text-4xl leading-[1.08] sm:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-[42ch] text-ink/70">{slide.text}</p>
                <div className="mt-8 flex gap-3">
                  <Link
                    href={slide.primaryHref}
                    className="rounded-full bg-ink px-7 py-3 text-sm text-ivory hover:bg-berry"
                  >
                    {slide.primaryLabel}
                  </Link>
                  <Link
                    href={slide.secondaryHref}
                    className="rounded-full border border-ink/20 px-7 py-3 text-sm hover:border-ink"
                  >
                    {slide.secondaryLabel}
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[5/4]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 14px;
        }
        .hero-swiper .swiper-pagination-bullet {
          background: var(--tw-color-ink, #2a2420);
          opacity: 0.35;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #7a2e43;
        }
      `}</style>
    </section>
  );
}