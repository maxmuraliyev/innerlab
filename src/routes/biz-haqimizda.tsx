import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { subscribeEmail } from "@/lib/content.functions";

export const Route = createFileRoute("/biz-haqimizda")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "Biz haqimizda — Inner Lab" },
      {
        name: "description",
        content:
          "Inner Lab — insonning fikrlashi, hissiyotlari va sog‘lig‘i uning hayotidagi tanlovlariga qanday ta’sir qilishini o‘rganuvchi platforma.",
      },
      { property: "og:title", content: "Biz haqimizda — Inner Lab" },
      {
        property: "og:description",
        content: "Inner Lab loyihasining maqsadi va tamoyillari.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/biz-haqimizda" },
    ],
    links: [{ rel: "canonical", href: "/biz-haqimizda" }],
  }),
});

function AboutPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />

      <header className="mx-auto max-w-3xl px-6 pt-20 pb-12">
        <span className="eyebrow text-green">Loyiha haqida</span>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
          Inner Lab — inson ichki dunyosini o‘rganuvchi tadqiqot maydoni
        </h1>
        <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/70">
          <p>
            Biz psixologiya, sog‘liq, ta’lim va shaxsiy rivojlanish o‘rtasidagi bog‘liqlikni
            o‘rganamiz. Har bir maqolada ilmiy asoslangan bilimni kundalik tajriba bilan
            bog‘lashga intilamiz.
          </p>
          <p>
            Asosiy savol o‘zgarmaydi: insonning fikrlashi, hissiyotlari va sog‘lig‘i uning
            o‘qishi, xulqi, xarakteri va hayotdagi tanlovlariga qanday ta’sir qiladi?
          </p>
        </div>
      </header>

      <section className="bg-ink py-20 text-cream" id="obuna">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl">Yangi maqolalardan xabardor bo‘ling</h2>
          <p className="mt-3 text-cream/60">
            Haftada bir marta — chuqur tahlil, spamsiz.
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await subscribeEmail({ data: { email } });
                setSent(true);
                setEmail("");
              } catch (err) {
                alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
              }
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Elektron pochtangiz"
              aria-label="Elektron pochta"
              className="flex-grow rounded-full border border-cream/15 bg-cream/5 px-5 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-green focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-green px-6 py-3 text-sm font-medium text-cream transition-opacity hover:opacity-90"
            >
              Obuna bo‘lish
            </button>
          </form>
          {sent && (
            <p className="mt-4 text-sm text-green">Rahmat! Obunangiz qabul qilindi.</p>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
