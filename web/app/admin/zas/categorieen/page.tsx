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
        <p>Categorieën zijn de uitklapbare groepen op de ZAS-pagina, zoals “Brood” of “Pistolets”.</p>
        <p>Met de pijltjes ▲ ▼ links van elke categorie bepaal je de volgorde op de pagina. Een nieuwe categorie komt onderaan.</p>
        <p>Een categorie hernoemen is veilig: de documenten blijven erin. Een categorie verwijderen wist ook alle documenten erin, en vraagt daarom dat je de naam overtikt.</p>
      </Help>
      <div className="mt-6">
        <CategoryManager categories={list} />
      </div>
    </Card>
  );
}
