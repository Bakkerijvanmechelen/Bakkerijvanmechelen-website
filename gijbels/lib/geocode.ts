import "server-only";

type Hit = { lat: number; lng: number; label: string };

async function search(params: Record<string, string>): Promise<Hit | null> {
  const qs = new URLSearchParams({ format: "json", limit: "1", countrycodes: "be", ...params });
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${qs}`, {
      headers: { "User-Agent": "gijbelsbakkerij-site/1.0 (beheer)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const [first] = (await res.json()) as { lat: string; lon: string; display_name: string }[];
    return first ? { lat: Number(first.lat), lng: Number(first.lon), label: first.display_name } : null;
  } catch {
    return null;
  }
}

/** Zoekt de plek van een adres op de kaart (OpenStreetMap). */
export async function geocode(street: string, postal: string, city: string): Promise<Hit | null> {
  const cityName = city.replace(/\(.*?\)/g, "").trim();
  return (
    (await search({ street, postalcode: postal, city: cityName })) ??
    (await search({ q: `${street}, ${postal} ${cityName}` })) ??
    // Laatste poging zonder huisnummer, dan staat de speld minstens in de juiste straat.
    (await search({ street: street.replace(/\s*\d+.*$/, ""), postalcode: postal, city: cityName }))
  );
}
