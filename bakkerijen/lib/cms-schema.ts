/**
 * Alle teksten en foto's die via het beheer aanpasbaar zijn, afgeleid van de beschrijving van de site.
 * Wat niet in de database staat, valt terug op de originele inhoud uit lib/sites.
 */
import type { Block, SiteDef } from "./sites/types";

export type FieldType = "text" | "textarea" | "image";
export type Field = { key: string; label: string; type: FieldType; default: string; help?: string };
export type Section = { id: string; title: string; fields: Field[] };
export type ContentPage = { id: string; title: string; href: string; sections: Section[] };

const text = (key: string, label: string, value: string, help?: string): Field => ({ key, label, type: "text", default: value, help });
const area = (key: string, label: string, value: string, help?: string): Field => ({ key, label, type: "textarea", default: value, help });
const image = (key: string, label: string, value: string): Field => ({ key, label, type: "image", default: value });

/** Sleutel van een blok: zijn plaats op de pagina. */
export const blockKey = (i: number) => `b${i + 1}`;

function blockSection(b: Block, i: number): Section {
  const k = blockKey(i);
  switch (b.type) {
    case "hero":
      return {
        id: k,
        title: "Bovenaan (grote foto)",
        fields: [
          image(`${k}.image`, "Foto", b.image),
          ...(b.eyebrow !== undefined ? [text(`${k}.eyebrow`, "Kleine titel boven de kop", b.eyebrow)] : []),
          text(`${k}.title`, "Kop", b.title),
          text(`${k}.subtitle`, "Ondertitel", b.subtitle ?? ""),
          text(`${k}.button`, "Tekst op de knop", b.button),
        ],
      };
    case "intro":
      return { id: k, title: `Tekst: ${b.title}`, fields: [text(`${k}.title`, "Titel", b.title), area(`${k}.text`, "Tekst", b.text)] };
    case "feature":
      return {
        id: k,
        title: `Blok: ${b.title || b.text.replace(/\*\*/g, "").slice(0, 40) + "…"}`,
        fields: [...(b.image ? [image(`${k}.image`, "Foto", b.image)] : []), text(`${k}.title`, "Titel", b.title), area(`${k}.text`, "Tekst", b.text)],
      };
    case "gallery":
      return { id: k, title: "Fotostrook", fields: b.images.map((src, n) => image(`${k}.image${n + 1}`, `Foto ${n + 1}`, src)) };
    case "band":
      return {
        id: k,
        title: `Donker blok: ${b.title}`,
        fields: [
          ...(b.image ? [image(`${k}.image`, "Achtergrondfoto", b.image)] : []),
          text(`${k}.title`, "Titel", b.title),
          ...(b.text !== undefined ? [area(`${k}.text`, "Tekst", b.text)] : []),
          ...(b.button !== undefined ? [text(`${k}.button`, "Tekst op de knop", b.button)] : []),
        ],
      };
  }
}

export function schemaFor(site: SiteDef): ContentPage[] {
  return [
    { id: "home", title: "Website", href: "/", sections: site.blocks.map(blockSection) },
    {
      id: "winkels",
      title: "Winkelgegevens",
      href: "/#winkels",
      sections: [
        { id: "shops", title: "Titel boven de winkels", fields: [text("shops.title", "Titel", site.shopsTitle)] },
        ...site.shops.map((s, i) => ({
          id: `shop${i + 1}`,
          title: s.label,
          fields: [
            text(`shop${i + 1}.label`, "Naam van de winkel", s.label),
            text(`shop${i + 1}.email`, "E-mailadres", s.email ?? "", "Leeg laten als er geen e-mailadres getoond moet worden."),
            text(`shop${i + 1}.vat`, "Ondernemingsnummer", s.vat ?? "", "Leeg laten als het niet getoond moet worden."),
          ],
        })),
      ],
    },
  ];
}

export const fieldsFor = (site: SiteDef): Field[] => schemaFor(site).flatMap((p) => p.sections.flatMap((s) => s.fields));
export const defaultsFor = (site: SiteDef): Record<string, string> => Object.fromEntries(fieldsFor(site).map((f) => [f.key, f.default]));
/** Velden die leeg mogen blijven (leeg is daar ook het origineel). */
export const optionalKeys = (site: SiteDef) => new Set(fieldsFor(site).filter((f) => f.default === "").map((f) => f.key));
