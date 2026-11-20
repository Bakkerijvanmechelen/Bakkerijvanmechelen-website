# Bakkerij-websites (gedeelde basis)

Eén codebase voor de websites van de bakkerijen in de groep. Elke site is een eigen Vercel-project met de
omgevingsvariabele `SITE` (vanbrempt, broodhuys, zwartearend, vanhecke, hermans, devers).

- Inhoud en huisstijl per site: `lib/sites/<site>.ts`
- Teksten en foto's zijn aanpasbaar via `/admin` (tabel `bakery_content`, opslag `bakery-site-images`)
- Adres, telefoon en openingsuren komen uit de winkellijst van Bakkerij Gijbels (`gijbels_shops`)
- Niet vindbaar voor Google tot `ALLOW_INDEXING=true` gezet wordt
