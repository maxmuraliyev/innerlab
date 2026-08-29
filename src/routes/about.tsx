import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { subscribeEmail } from "@/lib/content.functions";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — Inner Lab" },
      {
        name: "description",
        content:
          "Inner Lab — a platform exploring how human thinking, emotions, and health affect their life choices.",
      },
      { property: "og:title", content: "About Us — Inner Lab" },
      {
        property: "og:description",
        content: "The purpose and principles of the Inner Lab project.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function AboutPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-cream text-ink/90">
      <SiteNav />

      <header className="mx-auto max-w-3xl px-6 pt-20 pb-12">
        <span className="eyebrow text-green">About the project</span>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
          Inner Lab — a research space exploring the human inner world
        </h1>
        <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/70">
          <p>
            We explore the connections between psychology, health, education, and personal development. In every article, we strive to connect evidence-based knowledge with daily experience.
          </p>
          <p>
            The main question remains unchanged: how do human thinking, emotions, and health affect their learning, behavior, character, and life choices?
          </p>
        </div>
      </header>

      <section className="bg-ink py-20 text-cream" id="obuna">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-3xl">Stay updated with new articles</h2>
          <p className="mt-3 text-cream/60">
            Once a week — deep analysis, no spam.
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
                alert("An error occurred. Please try again.");
              }
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="flex-grow rounded-full border border-cream/15 bg-cream/5 px-5 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-green focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-green px-6 py-3 text-sm font-medium text-cream transition-opacity hover:opacity-90"
            >
              Subscribe
            </button>
          </form>
          {sent && (
            <p className="mt-4 text-sm text-green">Thank you! Your subscription has been received.</p>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
