import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/maqolalar", label: "Maqolalar" },
  { to: "/mavzular", label: "Mavzular" },
  { to: "/biz-haqimizda", label: "Biz haqimizda" },
];

export function SiteNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />
        
        {/* Desktop Nav */}
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
        
        <div className="hidden md:block">
          <Link
            to="/biz-haqimizda"
            hash="obuna"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-all hover:bg-ink/90"
          >
            Obuna bo‘lish
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden p-2 text-ink hover:text-green transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-ink/5 bg-cream absolute w-full shadow-lg pb-6">
          <div className="flex flex-col px-6 pt-4 space-y-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium uppercase tracking-wide py-2 transition-colors hover:text-green [&.active]:text-green border-b border-ink/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/biz-haqimizda"
              hash="obuna"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-block text-center mt-4 rounded-full bg-ink px-5 py-3 text-base font-medium text-cream transition-all hover:bg-ink/90"
            >
              Obuna bo‘lish
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
