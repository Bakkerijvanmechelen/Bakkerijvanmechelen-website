import ShopAdmin from "@/components/admin/ShopAdmin";
import { Help, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllShops } from "@/lib/shops";

export default async function Winkels() {
  await requireAdmin();
  const shops = await getAllShops();

  return (
    <>
      <PageHeader title="Winkels" intro="Hier beheer je de winkels die op de website staan: toevoegen, wijzigen, verbergen of verwijderen.">
        <Help title="Hoe voeg ik een winkel toe?">
          <p>1. Klik op <strong>+ Nieuwe winkel toevoegen</strong> en vul de gegevens in. Rechts ziet u meteen hoe de winkel op de website komt.</p>
          <p>2. Klik op <strong>Winkel toevoegen</strong>. De winkel wordt automatisch op de kaart gezet en staat meteen online.</p>
          <p>Met <strong>Verbergen</strong> verdwijnt een winkel tijdelijk van de website, zonder dat de gegevens verloren gaan. Met de pijltjes bepaalt u de volgorde.</p>
        </Help>
      </PageHeader>
      <ShopAdmin shops={shops} />
    </>
  );
}
