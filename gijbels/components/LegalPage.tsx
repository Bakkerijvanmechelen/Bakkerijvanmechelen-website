import PageHero from "./PageHero";

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Juridisch" title={title} subtitle={`Laatst bijgewerkt: ${updated}`} />
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-14">
        <div className="space-y-4 text-lg leading-relaxed [&_a]:font-bold [&_a]:text-blue [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-blue [&_li]:ml-5 [&_li]:list-disc [&_table]:w-full [&_td]:border-t [&_td]:border-ink/15 [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-left">
          {children}
        </div>
      </section>
    </>
  );
}
