import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="opacity-60">
          <Logo />
        </div>
        <p className="font-serif text-sm italic text-ink/50">
          “Inson ichki dunyosi uning hayotini qanday shakllantiradi?”
        </p>
        <div className="flex gap-6">
          <a href="#" className="eyebrow hover:text-green">
            Telegram
          </a>
          <a href="#" className="eyebrow hover:text-green">
            Instagram
          </a>
          <a href="#" className="eyebrow hover:text-green">
            Podcast
          </a>
        </div>
      </div>
    </footer>
  );
}
