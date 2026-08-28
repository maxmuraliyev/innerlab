import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const links = [
  { to: "/maqolalar", label: "Maqolalar" },
  { to: "/mavzular", label: "Mavzular" },
  { to: "/biz-haqimizda", label: "Biz haqimizda" },
];

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />
        <div className="hidden items-center gap-8 text-sm font-medium uppercase tracking-widest md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-green [&.active]:text-green"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/biz-haqimizda"
          hash="obuna"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-all hover:bg-ink/90"
        >
          Obuna bo‘lish
        </Link>
      </div>
    </nav>
  );
}
