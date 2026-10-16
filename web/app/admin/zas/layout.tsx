import Link from "next/link";
import ZasTabs from "@/components/admin/ZasTabs";
import { PageHeader } from "@/components/admin/ui";

export default function ZasLayout({ children }: LayoutProps<"/admin/zas">) {
  return (
    <>
      <PageHeader title="ZAS" intro="Hier beheer je de beveiligde pagina voor Ziekenhuis aan de Stroom: de documenten, de categorieën en het wachtwoord." />
      <ZasTabs />
      <div className="mt-8">{children}</div>
      <p className="mt-10 text-sm text-ink/60">
        Zo ziet de pagina eruit voor ZAS:{" "}
        <Link href="/ZAS" target="_blank" className="underline">
          open /ZAS
        </Link>
      </p>
    </>
  );
}
