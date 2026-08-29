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
      { title: "Inner Lab — About human inner world and life" },
      {
        name: "description",
        content:
          "A platform exploring the connections between psychology, health, education, and personal development. Articles, research, and explanations.",
      },
      { property: "og:title", content: "Inner Lab — About human inner world and life" },
      {
        property: "og:description",
        content: "Research on psychology, well-being, education, and personal development.",
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
              Research and Understanding
            </span>
            <h1 className="mb-8 font-serif text-4xl leading-[1.1] text-ink md:text-7xl">
              How does the human inner world{" "}
              <span className="italic text-green">shape their life?</span>
            </h1>
            <p className="max-w-xl text-xl leading-relaxed text-ink/70">
              A platform exploring the hidden connections between psychology, health, and personal development.
            </p>
          </div>
          <div className="lg:col-span-5">
            <img
              src={heroImg}
              alt="Abstract shape representing human thought"
              width={1024}
              height={1280}
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-ink">Latest Articles</h2>
            <div className="mt-4 h-1 w-20 bg-green" />
          </div>
          <Link
            to="/maqolalar"
            className="eyebrow border-b-2 border-green pb-1 hover:text-green"
          >
            View all
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
