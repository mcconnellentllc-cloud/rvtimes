import Nav from "@/components/Nav";
import { getDocuments } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const docs = await getDocuments();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Documents &amp; Manuals</h1>

        {docs.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No documents yet. Add rows to the <strong>Documents</strong> table in
            Airtable (Title, Type, and either a File attachment or a Link).
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {docs.map((d) => (
              <a
                key={d.id}
                href={d.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition ${
                  d.url ? "hover:border-brand hover:shadow" : "cursor-default opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">{d.title}</h2>
                  {d.type && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {d.type}
                    </span>
                  )}
                </div>
                {d.notes && <p className="mt-1 text-sm text-slate-500">{d.notes}</p>}
                {d.url ? (
                  <span className="mt-2 inline-block text-sm font-medium text-brand">
                    Open →
                  </span>
                ) : (
                  <span className="mt-2 inline-block text-sm text-slate-400">
                    No file linked
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
