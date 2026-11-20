export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="bg-dark text-flour">
        <div className="mx-auto max-w-3xl px-5 pb-14 pt-36">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/70">Juridisch</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{title}</h1>
          <p className="mt-3 text-flour/70">Laatst bijgewerkt: {updated}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-14">
        <div className="space-y-4 text-lg leading-relaxed [&_a]:font-bold [&_a]:text-brand [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-brand [&_li]:ml-5 [&_li]:list-disc [&_table]:w-full [&_td]:border-t [&_td]:border-ink/15 [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-left">
          {children}
        </div>
      </section>
    </>
  );
}
