/** Eén bakkerij-website. Alle sites delen dezelfde code; alleen deze beschrijving verschilt. */
export type Theme = {
  /** Merkkleur: knoppen, koppen en accenten. */
  brand: string;
  /** Tekstkleur op een vlak in de merkkleur. */
  onBrand: string;
  /** Donkere kleur voor de foto-banners en de footer. */
  dark: string;
  /** Lichte tint van de merkkleur, voor zachte vlakken. */
  soft: string;
};

export type Block =
  | { type: "hero"; image: string; eyebrow?: string; title: string; subtitle?: string; button: string }
  | { type: "intro"; title: string; text: string }
  | { type: "feature"; title: string; text: string; image?: string }
  | { type: "gallery"; images: string[] }
  | { type: "band"; image?: string; title: string; text?: string; button?: string };

export type SiteShop = {
  /** Naam van de winkel in de winkellijst van Bakkerij Gijbels; adres, telefoon en openingsuren komen daaruit. */
  match: { name: string; street: string };
  label: string;
  email?: string;
  vat?: string;
};

export type SiteDef = {
  id: string;
  name: string;
  /** Huidige domeinnaam, voor de livegang. */
  domain: string;
  metaTitle: string;
  metaDescription: string;
  theme: Theme;
  /** Logo-afbeelding, of null als de naam als tekst getoond wordt. */
  logo: { src: string; width: number; height: number } | null;
  tagline?: string;
  /** Zet het logo op een rond vlak in de merkkleur (voor een wit logo). */
  logoOnBrand?: boolean;
  /** Toon de naam naast het logo (voor een logo dat alleen een embleem is). */
  logoWithName?: boolean;
  /** Titel boven het adresblok onderaan. */
  shopsTitle: string;
  /**
   * Stijlkeuzes om dichter bij de oorspronkelijke site te blijven. Zonder deze keuzes volgt de site de gedeelde lijn.
   */
  style?: {
    /** Montserrat in plaats van de schreefletter voor de koppen. */
    sansHeadings?: boolean;
    /** Logo op een vierkant vlak in de merkkleur, met de naam in vette hoofdletters ernaast. */
    logoSquare?: boolean;
    /** Hero gecentreerd, met het logo als embleem en een lijn in de merkkleur naast de titel. */
    heroEmblem?: boolean;
    /** Inleiding op een vlak in de merkkleur over de volle breedte. */
    introOnBrand?: boolean;
    /** Tekstkolommen zonder kaarten, zoals op de oorspronkelijke site. */
    plainColumns?: boolean;
    /** Winkelblok op een vlak in de merkkleur. */
    shopsOnBrand?: boolean;
  };
  shops: SiteShop[];
  blocks: Block[];
};
