import { NextResponse, type NextRequest } from "next/server";
import { adminClient } from "@/lib/supabase/admin";
import { isZasUnlocked } from "@/lib/zas-auth";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Geeft een document vrij aan wie op de ZAS-pagina is ingelogd.
 * De tijdelijke link wordt pas gemaakt op het moment van klikken, dus ze is altijd vers.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await isZasUnlocked())) return NextResponse.redirect(new URL("/ZAS", request.url));
  if (!UUID.test(id)) return new NextResponse("Niet gevonden", { status: 404 });

  const supabase = adminClient();
  const { data: doc } = await supabase.from("zas_documents").select("file_path,file_name").eq("id", id).maybeSingle();
  if (!doc) return new NextResponse("Niet gevonden", { status: 404 });

  const download = request.nextUrl.searchParams.get("download") === "1";
  const { data } = await supabase.storage
    .from("zas-documents")
    .createSignedUrl(doc.file_path, 60, download ? { download: doc.file_name } : undefined);
  if (!data?.signedUrl) return new NextResponse("Het document kon niet worden geopend", { status: 502 });

  const res = NextResponse.redirect(data.signedUrl);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
