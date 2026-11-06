import type { ReactNode } from "react";
import { Head } from "@inertiajs/react";
import wordmarkUrl from "@/assets/sidequack-wordmark-cream.png";

export function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 pt-[max(--spacing(4),env(safe-area-inset-top))] pr-[max(--spacing(4),env(safe-area-inset-right))] pb-[max(--spacing(4),env(safe-area-inset-bottom))] pl-[max(--spacing(4),env(safe-area-inset-left))]">
      <Head title={title} />
      <img src={wordmarkUrl} alt="CouchDuck" className="h-8" />
      {children}
    </main>
  );
}
