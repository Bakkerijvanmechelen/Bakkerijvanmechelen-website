import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-36">
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-ink/60">Laatst bijgewerkt: {updated}</p>
        <div className="mt-8 space-y-4 text-lg leading-relaxed [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_li]:ml-5 [&_li]:list-disc [&_table]:w-full [&_td]:border-t [&_td]:border-ink/15 [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-left">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
