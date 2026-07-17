import Nav from "@/components/Nav";
import { getMaintenance } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const rows = await getMaintenance();

  const upcoming = rows.filter(
    (r) => (r.status || "").toLowerCase() === "upcoming" || (r.status || "").toLowerCase() === "due"
  );
  const history = rows.filter(
    (r) => !((r.status || "").toLowerCase() === "upcoming" || (r.status || "").toLowerCase() === "due")
  );

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Maintenance Log</h1>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No maintenance records yet. Add rows to the <strong>Maintenance Log</strong>{" "}
            table in Airtable (Date, Service, Mileage, Cost, Vendor, Status, Notes).
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {upcoming.length > 0 && (
              <Section title="Upcoming / Due" rows={upcoming} highlight />
            )}
            <Section title="Service History" rows={history} />
          </div>
        )}
      </main>
    </>
  );
}

function Section({
  title,
  rows,
  highlight,
}: {
  title: string;
  rows: Awaited<ReturnType<typeof getMaintenance>>;
  highlight?: boolean;
}) {
  if (rows.length === 0) return null;
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand">
        {title}
      </h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Mileage</th>
              <th className="px-4 py-2">Cost</th>
              <th className="px-4 py-2">Vendor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className={`border-b border-slate-100 last:border-0 ${
                  highlight ? "bg-amber-50" : ""
                }`}
              >
                <td className="whitespace-nowrap px-4 py-2 text-slate-700">{r.date}</td>
                <td className="px-4 py-2 text-slate-900">
                  {r.service}
                  {r.notes && (
                    <span className="block text-xs text-slate-400">{r.notes}</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-slate-700">{r.mileage}</td>
                <td className="whitespace-nowrap px-4 py-2 text-slate-700">{r.cost}</td>
                <td className="whitespace-nowrap px-4 py-2 text-slate-700">{r.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
