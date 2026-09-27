const TESTIMONIALS = [
  {
    quote: "Ordered a personalized star map for our anniversary — arrived two days early, beautifully packed.",
    name: "Ananya R., Delhi",
  },
  {
    quote: "The hamper looked exactly like the photos, which almost never happens. Will order again for Diwali.",
    name: "Karan M., Pune",
  },
  {
    quote: "Customer support helped me change the gift message after checkout without any fuss.",
    name: "Priya S., Bengaluru",
  },
];

export default function Testimonials() {
  return (
    <section className="container-page mt-20">
      <h2 className="font-display text-2xl sm:text-3xl">From people who've given these</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-2xl border border-ink/10 p-6">
            <p className="text-[15px] leading-relaxed text-ink/80">"{t.quote}"</p>
            <p className="mt-4 text-sm text-ink/50">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
