export default function Newsletter() {
  return (
    <section className="container-page mt-20">
      <div className="rounded-3xl bg-berry px-8 py-14 text-center text-ivory sm:py-16">
        <h2 className="font-display text-2xl sm:text-3xl">Never miss an occasion</h2>
        <p className="mx-auto mt-2 max-w-[46ch] text-ivory/80">
          Get a reminder a week before the dates that matter, plus first access to new arrivals.
        </p>
        <form className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full rounded-full px-4 py-3 text-sm text-ink outline-none"
          />
          <button className="rounded-full bg-ivory px-6 py-3 text-sm text-ink">Join</button>
        </form>
      </div>
    </section>
  );
}
