import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <main className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Shiter
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Usuarios y mascotas con NestJS, Prisma y Next.js.
        </p>
        <Link
          href="/usuarios"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Ir a usuarios
        </Link>
      </main>
    </div>
  );
}
