import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import { listArticles } from "@/lib/content.functions";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  loader: async () => {
    return await listArticles();
  },
  component: Index,
  head: () => ({
    meta: [
      { title: "Inner Lab — Inson ichki dunyosi va hayoti haqida" },
      {
        name: "description",
        content:
          "Psixologiya, sog‘liq, ta’lim va shaxsiy rivojlanish o‘rtasidagi bog‘liqlikni o‘rganuvchi platforma. Maqolalar, tadqiqotlar va tushuntirishlar.",
      },
      { property: "og:title", content: "Inner Lab — Inson ichki dunyosi va hayoti haqida" },
      {
        property: "og:description",
        content: "Psixologiya, farovonlik, ta’lim va shaxsiy rivojlanish haqida tadqiqotlar.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const articles = Route.useLoaderData();
  const latest = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />

      <header className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow mb-6 inline-block rounded-full border border-green px-3 py-1 italic text-green">
              Tadqiqot va tushunish
            </span>
            <h1 className="mb-8 font-serif text-5xl leading-[1.1] text-ink md:text-7xl">
              Inson ichki dunyosi uning hayotini{" "}
              <span className="italic text-green">qanday shakllantiradi?</span>
            </h1>
            <p className="max-w-xl text-xl leading-relaxed text-ink/70">
              Psixologiya, sog‘liq va shaxsiy rivojlanish o‘rtasidagi yashirin bog‘liqlikni
              o‘rganuvchi platforma.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img
              src={heroImg}
              alt="Inson tafakkurini ifodalovchi abstrakt shakl"
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </header>

      <section className="bg-ink py-24 text-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Mental farovonlik",
                d: "Stress, uyqu va motivatsiya insonning kundalik qarorlariga qanday ta’sir qilishini ilmiy asosda tahlil qilamiz.",
              },
              {
                n: "02",
                t: "Ta’lim va xulq",
                d: "Samarali o‘rganish va odatlar shakllanishi ortidagi psixologik jarayonlarni ochiqlaymiz.",
              },
              {
                n: "03",
                t: "Hayotiy tanlovlar",
                d: "Xarakter va temperament hayotdagi strategik qarorlarimizda qanday rol o‘ynashini o‘rganing.",
              },
            ].map((p) => (
              <div key={p.n} className="space-y-4">
                <div className="flex size-12 items-center justify-center rounded-full border border-cream/20 font-serif text-xl italic text-green">
                  {p.n}
                </div>
                <h3 className="font-serif text-2xl">{p.t}</h3>
                <p className="leading-relaxed text-cream/60">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-4xl text-ink">So‘nggi maqolalar</h2>
            <div className="mt-4 h-1 w-20 bg-green" />
          </div>
          <Link
            to="/maqolalar"
            className="eyebrow border-b-2 border-green pb-1 hover:text-green"
          >
            Barchasini ko‘rish
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((a: any) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
