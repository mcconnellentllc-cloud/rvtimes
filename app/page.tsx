import Link from "next/link";
import Nav from "@/components/Nav";

const cards = [
  {
    href: "/info",
    title: "RV Info",
    desc: "Specs, systems, dimensions, and capacities at a glance.",
  },
  {
    href: "/maintenance",
    title: "Maintenance Log",
    desc: "Service history, costs, and what's coming up.",
  },
  {
    href: "/documents",
    title: "Documents",
    desc: "Manuals, warranties, receipts, and photos.",
  },
  {
    href: "/ask",
    title: "Ask",
    desc: "Search everything you know about your RV.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Your RV, all in one place</h1>
        <p className="mt-2 text-slate-500">
          Pick a section to get started.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand hover:shadow"
            >
              <h2 className="text-lg font-semibold text-brand">{c.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
