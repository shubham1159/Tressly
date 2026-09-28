"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

// NOTE: loop mode needs more slides than slidesPerView (3 on desktop),
// so keep at least 6 testimonials here or the autoplay/loop will misbehave.
const TESTIMONIALS = [
  {
    quote: "Ordered a personalized star map for our anniversary — arrived two days early, beautifully packed.",
    name: "Ananya R., Delhi",
    rating: 5,
  },
  {
    quote: "The hamper looked exactly like the photos, which almost never happens. Will order again for Diwali.",
    name: "Karan M., Pune",
    rating: 5,
  },
  {
    quote: "Customer support helped me change the gift message after checkout without any fuss.",
    name: "Priya S., Bengaluru",
    rating: 5,
  },
  {
    quote: "The silk scrunchies are so soft, no more creases in my hair. Already bought a second set.",
    name: "Sneha K., Mumbai",
    rating: 5,
  },
  {
    quote: "Wore the pearl pins for my sister's wedding and got compliments all night. They held up perfectly.",
    name: "Riya T., Jaipur",
    rating: 5,
  },
  {
    quote: "Packaging felt premium and delivery was quick. Great quality for the price.",
    name: "Meera D., Hyderabad",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="container-page mt-20">
      <h2 className="font-display text-2xl sm:text-3xl">From people who've given these</h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        loop
        speed={700}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="testimonial-swiper mt-6 !pb-12"
      >
        {TESTIMONIALS.map((t) => (
          <SwiperSlide key={t.name} className="!h-auto">
            <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white/40 p-6 transition-shadow hover:shadow-md">
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className={idx < t.rating ? "fill-gold text-gold" : "text-ink/20"}
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/80">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm text-ink/50">{t.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .testimonial-swiper .swiper-pagination-bullet {
          background: #2a2420;
          opacity: 0.3;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #7a2e43;
        }
      `}</style>
    </section>
  );
}