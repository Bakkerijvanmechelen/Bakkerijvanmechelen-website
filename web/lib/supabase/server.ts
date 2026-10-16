import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Client met de sessie van de ingelogde gebruiker (cookies). */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Aangeroepen vanuit een Server Component: de proxy ververst de sessie al.
          }
        },
      },
    },
  );
}
