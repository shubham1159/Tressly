import Link from "next/link";
import Image from "next/image";

const OCCASIONS = [
  { label: "Everyday", slug: "everyday", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600" },
  { label: "Office", slug: "office", image: "https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=600" },
  { label: "Party", slug: "party", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600" },
  { label: "Bridal", slug: "bridal", image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600" },
];

export default function Occasions() {
  return (
    <section className="container-page mt-20">
      <h2 className="font-display text-2xl sm:text-3xl">Shop by look</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {OCCASIONS.map((o) => (
          <Link key={o.slug} href={`/occasions/${o.slug}`} className="group relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={o.image}
              alt={o.label}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/25" />
            <span className="absolute bottom-4 left-4 font-display text-lg text-ivory">{o.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
