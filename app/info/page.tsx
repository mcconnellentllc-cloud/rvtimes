import Nav from "@/components/Nav";
import { getRvInfo } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export default async function InfoPage() {
  const rows = await getRvInfo();

  const byCategory = rows.reduce<Record<string, typeof rows>>((acc, r) => {
    const key = r.category || "General";
    (acc[key] ||= []).push(r);
    return acc;
  }, {});
  const categories = Object.keys(byCategory).sort();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">RV Info</h1>

        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-6 space-y-8">
            {categories.map((cat) => (
              <section key={cat}>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
                  {cat}
                </h2>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-sm">
                    <tbody>
                      {byCategory[cat].map((r) => (
                        <tr key={r.id} className="border-b border-slate-100 last:border-0">
                          <td className="w-1/3 px-4 py-2 font-medium text-slate-700">
                            {r.item}
                          </td>
                          <td className="px-4 py-2 text-slate-900">
                            {r.value}
                            {r.notes && (
                              <span className="block text-xs text-slate-400">{r.notes}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      No RV info yet. Add rows to the <strong>RV Info</strong> table in Airtable
      (Category, Item, Value, Notes) and they&apos;ll appear here.
    </div>
  );
}
