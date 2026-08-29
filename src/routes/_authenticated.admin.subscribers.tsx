import { createFileRoute } from "@tanstack/react-router";
import { listSubscribers, sendBulkEmail } from "@/lib/admin.functions";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/subscribers")({
  loader: async () => {
    return await listSubscribers();
  },
  component: AdminSubscribers,
});

function AdminSubscribers() {
  const subscribers = Route.useLoaderData();
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Rostdan ham ${subscribers.length} ta obunachiga xat yubormoqchimisiz?`)) return;
    
    setSending(true);
    setResult(null);
    try {
      const res = await sendBulkEmail({ data: { subject, html } });
      setResult(`Muvaffaqiyatli: ${res.sent} ta xat yuborildi.`);
      setSubject("");
      setHtml("");
    } catch (err: any) {
      setResult(`Xatolik: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const copyEmails = () => {
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    alert("Barcha emaillar nusxalandi!");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold">Obunachilar</h1>
          <button
            onClick={copyEmails}
            className="rounded-lg bg-ink/10 px-4 py-2 text-sm font-medium hover:bg-ink/20"
          >
            Nusxalash (Copy All)
          </button>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/5">
              <tr>
                <th className="px-6 py-4 font-medium text-ink/70">Email</th>
                <th className="px-6 py-4 font-medium text-ink/70">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4 font-medium">{sub.email}</td>
                  <td className="px-6 py-4 text-ink/70">
                    {new Date(sub.created_at).toLocaleDateString("uz-UZ")}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-ink/50">
                    Obunachilar yo'q.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold">Ommaviy xabar yuborish</h2>
          <p className="mt-2 text-sm text-ink/60">
            Barcha obunachilarga bitta tugma orqali elektron pochta jo'natishingiz mumkin.
            Resend orqali ishlaydi.
          </p>
        </div>

        <form onSubmit={handleSendEmail} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              Sarlavha (Subject)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-ink/10 bg-cream/30 px-4 py-2 outline-none focus:border-green"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink/70">
              Xabar (HTML formatda yozish mumkin)
            </label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full rounded-lg border border-ink/10 bg-cream/30 px-4 py-2 outline-none focus:border-green font-mono text-sm"
              rows={10}
              required
              placeholder="<h1>Salom</h1><p>Yangi maqola chiqdi!</p>"
            />
          </div>
          
          {result && (
            <div className={`rounded-lg p-4 text-sm ${result.startsWith("Muvaffaqiyatli") ? "bg-green/10 text-green" : "bg-red-50 text-red-600"}`}>
              {result}
            </div>
          )}

          <button
            type="submit"
            disabled={sending || subscribers.length === 0}
            className="w-full rounded-lg bg-green py-3 font-medium text-white hover:bg-green/90 disabled:opacity-50"
          >
            {sending ? "Yuborilmoqda..." : "Barchasiga yuborish"}
          </button>
        </form>
      </div>
    </div>
  );
}
