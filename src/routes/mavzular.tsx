import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { categories, articles } from "@/data/articles";

export const Route = createFileRoute("/mavzular")({
  component: TopicsPage,
  head: () => ({
    meta: [
      { title: "Mavzular — Inner Lab" },
      {
        name: "description",
        content:
          "Psixologiya, farovonlik, ta’lim, uyqu va stress, xarakter, shaxsiy rivojlanish va qarorlar — Inner Lab mavzulari.",
      },
      { property: "og:title", content: "Mavzular — Inner Lab" },
      {
        property: "og:description",
        content: "Inner Lab o‘rganadigan yetti asosiy yo‘nalish.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/mavzular" },
    ],
    links: [{ rel: "canonical", href: "/mavzular" }],
  }),
});

function TopicsPage() {
  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <span className="eyebrow text-green">Yo‘nalishlar</span>
        <h1 className="mt-4 font-serif text-5xl text-ink md:text-6xl">Mavzular</h1>
        <div className="mt-6 h-1 w-20 bg-green" />
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = articles.filter((a) => a.category === c.name).length;
            return (
              <div key={c.slug} className="bg-cream p-8">
                <div className="text-2xl">{c.emoji}</div>
                <h2 className="mt-4 font-serif text-2xl text-ink">{c.name}</h2>
                <p className="mt-2 text-sm text-ink/60">{c.desc}</p>
                <p className="mt-6 text-xs text-ink/40">{count} ta maqola</p>
              </div>
            );
          })}
        </div>
        <div className="mt-12">
          <Link to="/maqolalar" className="eyebrow border-b-2 border-green pb-1 hover:text-green">
            Barcha maqolalar
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
