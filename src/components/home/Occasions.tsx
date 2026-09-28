import Link from "next/link";
import Image from "next/image";

const OCCASIONS = [
  { label: "Everyday", slug: "everyday", image: "/images/everyday_.jpg" },
  { label: "Office", slug: "office", image: "/images/office.webp" },
  { label: "Party", slug: "party", image: "/images/party_.jpg" },
  { label: "Bridal", slug: "bridal", image: "/images/wedding.jpg" },
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
