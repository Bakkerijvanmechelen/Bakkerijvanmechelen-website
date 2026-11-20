import { broodhuys } from "./sites/broodhuys";
import { devers } from "./sites/devers";
import { hermans } from "./sites/hermans";
import type { SiteDef } from "./sites/types";
import { vanbrempt } from "./sites/vanbrempt";
import { vanhecke } from "./sites/vanhecke";
import { zwartearend } from "./sites/zwartearend";

export const sites: Record<string, SiteDef> = { vanbrempt, broodhuys, zwartearend, vanhecke, hermans, devers };

/** De website die deze installatie toont. Elk Vercel-project zet zijn eigen SITE. */
export const site: SiteDef = sites[process.env.SITE ?? ""] ?? vanbrempt;

/** Het definitieve adres van deze site (met www, zoals op de oorspronkelijke site). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? `https://www.${site.domain}`;
