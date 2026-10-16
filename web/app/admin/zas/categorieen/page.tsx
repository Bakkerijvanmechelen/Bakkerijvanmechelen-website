import CategoryManager from "@/components/admin/CategoryManager";
import { Card, Help } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { getCategories } from "@/lib/zas-data";

export default async function Categorieen() {
  await requireAdmin();
  const [categories, { data: docs }] = await Promise.all([getCategories(), adminClient().from("zas_documents").select("category_id")]);
  const list = categories.map((c) => ({ ...c, count: docs?.filter((d) => d.category_id === c.id).length ?? 0 }));

  return (
    <Card title="Categorieën">
      <Help title="Wat zijn categorieën?">
        <p>Categorieën zijn de uitklapbare groepen op de ZAS-pagina, zoals “01 Brood” of “04 Pistolets”.</p>
        <p>Ze staan op alfabet. Zet een nummer voor de naam (01, 02, 03…) om zelf de volgorde te bepalen.</p>
        <p>Een categorie hernoemen is veilig: de documenten blijven erin. Een categorie verwijderen wist ook alle documenten erin, en vraagt daarom dat je de naam overtikt.</p>
      </Help>
      <div className="mt-6">
        <CategoryManager categories={list} />
      </div>
    </Card>
  );
}
