export type Shop = {
  id: string;
  name: string;
  kind: "eigen" | "groep";
  street: string;
  postal_code: string;
  city: string;
  phone: string | null;
  fax: string | null;
  note: string | null;
  website: string | null;
  /** Link naar de webshop van deze winkel (optioneel). */
  webshop_url: string | null;
  /** Link naar het Google-bedrijfsprofiel, voor actuele openingsuren (optioneel). */
  google_url: string | null;
  hours: string | null;
  logo_url: string | null;
  lat: number | null;
  lng: number | null;
  position: number;
  visible: boolean;
};

export const kindLabel: Record<Shop["kind"], string> = {
  eigen: "Gijbels-winkel",
  groep: "Bakkerij in de groep",
};

/** Openingsuren staan als tekst, één regel per dag of groep van dagen. */
export const hoursLines = (h: string | null) =>
  (h ?? "")
    .split("\n")
    .map(tidyHoursLine)
    .filter(Boolean);

/**
 * Maakt een regel openingsuren netjes: "ma, do , vrij : 7.00 u - 18.00 u" wordt "ma, do, vrij: 7.00u – 18.00u".
 * Een tijdsbereik breekt niet af over twee regels (vaste spaties), dus "14.00 u" valt nooit uit elkaar.
 */
export function tidyHoursLine(line: string) {
  const time = String.raw`\d{1,2}(?:[.:]\d{2})?`;
  return line
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+([,:;])/g, "$1")
    .replace(/([,;])(?=\S)/g, "$1 ")
    .replace(/:(?=[^\s\d])/g, ": ")
    .replace(new RegExp(`(${time})\\s*u\\b`, "gi"), "$1u")
    .replace(new RegExp(`(${time}u)\\s*[-–—]\\s*(${time}u)`, "gi"), "$1\u00A0–\u00A0$2");
}

export const addressLine = (s: Pick<Shop, "street" | "postal_code" | "city">) => `${s.street}, ${s.postal_code} ${s.city}`;

export const routeUrl = (s: Pick<Shop, "street" | "postal_code" | "city">) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine(s))}`;

export const websiteUrl = (w: string) => (/^https?:\/\//i.test(w) ? w : `https://${w}`);
export const websiteLabel = (w: string) => w.replace(/^https?:\/\//i, "").replace(/\/$/, "");
export const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;
