import { Star } from "lucide-react";

export default function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-ink/60">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < Math.round(rating) ? "fill-gold text-gold" : "fill-ink/10 text-ink/10"}
          />
        ))}
      </div>
      {typeof count === "number" && <span>({count})</span>}
    </div>
  );
}
