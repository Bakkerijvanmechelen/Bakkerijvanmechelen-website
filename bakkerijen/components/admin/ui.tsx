import type { ReactNode } from "react";

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
      {intro && <p className="mt-2 max-w-2xl text-lg text-ink/70">{intro}</p>}
      {children}
    </header>
  );
}

export function Card({ title, step, children, className = "" }: { title?: string; step?: number; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-white p-6 shadow-sm ${className}`}>
      {title && (
        <h2 className="mb-4 flex items-center gap-3 font-display text-xl">
          {step && <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-flour">{step}</span>}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/** Uitklapbare uitleg, standaard dicht zodat de pagina rustig blijft. */
export function Help({ title = "Hoe werkt dit?", children }: { title?: string; children: ReactNode }) {
  return (
    <details className="group mt-4 max-w-2xl rounded-xl border border-sage bg-sage-light/30 px-4 py-3">
      <summary className="cursor-pointer list-none font-bold">
        <span className="mr-2 inline-grid size-5 place-items-center rounded-full bg-ink text-xs text-flour">?</span>
        {title}
      </summary>
      <div className="mt-3 grid gap-2 text-ink/80">{children}</div>
    </details>
  );
}

export function Pill({ tone, children }: { tone: "green" | "amber" | "red" | "grey"; children: ReactNode }) {
  const t = {
    green: "bg-green-100 text-green-900",
    amber: "bg-amber-100 text-amber-900",
    red: "bg-red-100 text-red-900",
    grey: "bg-ink/10 text-ink/70",
  }[tone];
  return <span className={`inline-block rounded-full px-3 py-0.5 text-sm font-bold ${t}`}>{children}</span>;
}

export const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-bold text-flour transition hover:bg-crust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crust disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/25 px-5 py-2.5 font-bold transition hover:border-crust hover:text-crust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crust disabled:cursor-not-allowed disabled:opacity-50";
export const dangerBtn =
  "inline-flex items-center justify-center rounded-full bg-red-700 px-5 py-2.5 font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40";
export const fieldCls =
  "w-full rounded-lg border border-ink/25 bg-white px-4 py-3 text-base outline-none transition focus:border-crust focus:ring-2 focus:ring-crust/30 disabled:bg-ink/5";

export const Icon = {
  pencil: <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" />,
  home: <path d="M3 11 12 3l9 8M5 9.5V21h5v-6h4v6h5V9.5" />,
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
  folder: <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  store: (<><path d="M4 9 5.5 4h13L20 9" /><path d="M4 9h16v2a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0z" /><path d="M5 13v7h14v-7M10 20v-4h4v4" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
};

export function Svg({ children, className = "size-5" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}
