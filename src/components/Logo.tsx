import { Link } from "@tanstack/react-router";

export function Logo({ tone = "ink" }: { tone?: "ink" | "cream" }) {
  return (
    <Link to="/" className="flex items-baseline gap-0.5" aria-label="Inner Lab bosh sahifa">
      <span
        className={`font-serif text-2xl font-black tracking-tight ${tone === "cream" ? "text-cream" : "text-ink"
          }`}
      >
        inner
      </span>
      <span className="font-sans text-2xl font-light tracking-tight text-green">lab</span>
    </Link>
  );
}
