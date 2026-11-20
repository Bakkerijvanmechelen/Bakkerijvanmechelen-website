# Websites Bakkerij Van Mechelen & Gijbels-groep

Alle websites van de groep in één repository. Elke map is een eigen Next.js-app met een eigen Vercel-project
(team Bakkerijvanmechelen). Een project bouwt alleen opnieuw als er in zijn eigen map iets wijzigt.

| Map | Website(s) | Vercel-project(en) |
|---|---|---|
| `web/` | Bakkerij Van Mechelen (met beheer en ZAS-pagina) | `bakkerijvanmechelen` |
| `gijbels/` | Bakkerij Gijbels (met winkelbeheer) | `gijbelsbakkerij` |
| `bakkerijen/` | Van Brempt, 't Broodhuys, De Zwarte Arend, Van Hecke, Hermans, Devers (één gedeelde code, `SITE` per project) | `bakkerij-vanbrempt`, `bakkerij-broodhuys`, `bakkerij-zwartearend`, `bakkerij-vanhecke`, `bakkerij-hermans`, `bakkerij-devers` |

Gedeeld:
- Database, opslag en beheerderslogin: Supabase-project `jsxdsigtwanxykbmvdhc`
- Geheimen staan in Vercel (omgevingsvariabelen), nooit in deze repository
- Niet vindbaar voor Google tot `ALLOW_INDEXING=true` in het Vercel-project staat; de vercel.app-adressen blijven altijd noindex
