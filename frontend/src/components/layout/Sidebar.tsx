'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/usuarios', label: 'Usuarios' },
  { href: '/mascotas', label: 'Mascotas' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:sticky md:top-0 md:flex md:h-dvh md:w-60 md:shrink-0 md:flex-col md:border-r md:border-b-0">
      <div className="flex items-center justify-between gap-6 px-5 py-4 md:flex-1 md:flex-col md:items-stretch md:justify-start md:gap-10 md:px-5 md:py-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Shiter
        </Link>
        <nav className="flex gap-2 md:flex-col">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
