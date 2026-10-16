"use server";

import { redirect } from "next/navigation";
import { lockZas, unlockZas } from "@/lib/zas-auth";

export type ZasState = { message: string } | null;

export async function unlock(_prev: ZasState, formData: FormData): Promise<ZasState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { message: "Geef het wachtwoord in." };
  if (!(await unlockZas(password))) return { message: "Onjuist wachtwoord." };
  redirect("/ZAS");
}

export async function lock() {
  await lockZas();
  redirect("/ZAS");
}
