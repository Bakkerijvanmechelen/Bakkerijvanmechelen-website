import CopyButton from "@/components/admin/CopyButton";
import PasswordPanel from "@/components/admin/PasswordPanel";
import { Card, Help, Pill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { getZasPasswordInfo } from "@/lib/zas-auth";

const fmt = new Intl.DateTimeFormat("nl-BE", { dateStyle: "long", timeZone: "Europe/Brussels" });

export default async function Toegang() {
  await requireAdmin();
  const pw = await getZasPasswordInfo();
  const url = "https://bakkerijvanmechelen.vercel.app/ZAS";

  return (
    <div className="grid gap-8">
      <Card title="Toegang tot de ZAS-pagina">
        <p className="flex flex-wrap items-center gap-3 text-lg">
          {pw.isSet ? <Pill tone="green">Beveiligd met wachtwoord</Pill> : <Pill tone="red">Nog geen wachtwoord, niemand kan de pagina openen</Pill>}
          {pw.updatedAt && <span className="text-ink/60">Laatst gewijzigd op {fmt.format(new Date(pw.updatedAt))}</span>}
        </p>
        <p className="mt-5 font-bold">De link voor ZAS</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-flour px-4 py-2.5">{url}</code>
          <CopyButton text={url} label="Link kopiëren" />
        </div>
      </Card>

      <Card title={pw.isSet ? "Wachtwoord wijzigen" : "Wachtwoord instellen"}>
        <Help title="Goed om te weten">
          <p>Het wachtwoord is voor iedereen bij ZAS hetzelfde. Wie het kent, ziet alle technische fiches.</p>
          <p>Het wachtwoord wordt beveiligd bewaard en kan nooit worden teruggelezen. Geef het dus door op het moment dat je het instelt.</p>
          <p>Vermoed je dat het in verkeerde handen is? Stel gewoon een nieuw in: iedereen wordt dan meteen afgemeld.</p>
        </Help>
        <div className="mt-6">
          <PasswordPanel isSet={pw.isSet} />
        </div>
      </Card>
    </div>
  );
}
