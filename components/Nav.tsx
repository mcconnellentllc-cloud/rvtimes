"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/info", label: "RV Info" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/documents", label: "Documents" },
  { href: "/ask", label: "Ask" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand">
          RV&nbsp;Times
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="ml-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
