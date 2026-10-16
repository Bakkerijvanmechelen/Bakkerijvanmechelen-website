import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Document openen vanuit het beheer; alleen voor ingelogde beheerders. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await getAdmin())) return NextResponse.redirect(new URL("/admin/login", request.url));
  if (!UUID.test(id)) return new NextResponse("Niet gevonden", { status: 404 });

  const supabase = adminClient();
  const { data: doc } = await supabase.from("zas_documents").select("file_path").eq("id", id).maybeSingle();
  if (!doc) return new NextResponse("Niet gevonden", { status: 404 });

  const { data } = await supabase.storage.from("zas-documents").createSignedUrl(doc.file_path, 60);
  if (!data?.signedUrl) return new NextResponse("Het document kon niet worden geopend", { status: 502 });

  const res = NextResponse.redirect(data.signedUrl);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
