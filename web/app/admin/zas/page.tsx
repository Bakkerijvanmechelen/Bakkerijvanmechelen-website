import DocumentList from "@/components/admin/DocumentList";
import UploadWizard from "@/components/admin/UploadWizard";
import { Card, Help } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { getCategories } from "@/lib/zas-data";

export default async function ZasDocumenten() {
  await requireAdmin();
  const supabase = adminClient();
  const [{ data: docs }, categories] = await Promise.all([
    supabase.from("zas_documents").select("*").order("title"),
    getCategories(),
  ]);

  const withUrls = (docs ?? []).map((d) => ({
    id: d.id as string,
    title: d.title as string,
    fileName: d.file_name as string,
    size: d.size_bytes as number | null,
    createdAt: d.created_at as string,
    categoryId: d.category_id as string,
    viewUrl: `/admin/zas/file/${d.id}`,
  }));
  const groups = categories.map((c) => ({ id: c.id, name: c.name, docs: withUrls.filter((d) => d.categoryId === c.id) }));

  return (
    <div className="grid gap-8">
      <Card title="Documenten toevoegen">
        <Help title="Zo voeg je een technische fiche toe">
          <p>1. Sleep de pdf in het vak, of klik erop om hem te kiezen. Meerdere tegelijk mag.</p>
          <p>2. Controleer de naam en de categorie die het systeem uit de pdf haalt. Pas aan wat niet klopt.</p>
          <p>3. Bestaat de fiche al (zelfde naam)? Dan staat er “Vervangt de bestaande fiche”: de oude wordt vervangen door de nieuwe, er komt geen dubbele bij.</p>
          <p>4. Klik op “Bevestigen en opslaan”. Pas dan komt het document op de ZAS-pagina.</p>
        </Help>
        <div className="mt-6">
          <UploadWizard categories={categories} existing={withUrls.map((d) => ({ id: d.id, title: d.title, categoryId: d.categoryId }))} />
        </div>
      </Card>

      <Card title={`Alle documenten (${withUrls.length})`}>
        <DocumentList groups={groups} categories={categories} />
      </Card>
    </div>
  );
}
