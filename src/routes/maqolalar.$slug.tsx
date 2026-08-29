import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getArticleBySlug } from "@/lib/content.functions";

export const Route = createFileRoute("/maqolalar/$slug")({
  loader: async ({ params }) => {
    const article = await getArticleBySlug({ data: { slug: params.slug } });
    if (!article) throw notFound();
    return article;
  },
  component: ArticleDetail,
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `${loaderData.title} — Inner Lab` },
        { name: "description", content: loaderData.excerpt },
        { property: "og:title", content: `${loaderData.title} — Inner Lab` },
        { property: "og:description", content: loaderData.excerpt },
        { property: "og:type", content: "article" },
      ],
    };
  },
});

function ArticleDetail() {
  const article = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-6 pt-20 pb-24">
        <header className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="eyebrow rounded-full border border-green px-3 py-1 text-green">
              {article.category}
            </span>
            <span className="text-sm font-medium text-ink/50">
              {article.reading_time}
            </span>
          </div>
          <h1 className="font-serif text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-ink/70">
            {article.excerpt}
          </p>
        </header>

        {article.image_url && (
          <div className="mb-16 aspect-[21/9] w-full overflow-hidden rounded-2xl">
            <img
              src={article.image_url}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg prose-ink max-w-none prose-headings:font-serif prose-headings:font-normal prose-a:text-green prose-a:underline-offset-4 hover:prose-a:text-green/80 prose-img:rounded-xl">
          {article.body.split("\n\n").map((p: string, i: number) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
