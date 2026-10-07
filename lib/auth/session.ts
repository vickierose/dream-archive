import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export async function requireUser() {
  const { data, error } = await auth.getSession();
  if (error) throw new Error("Unable to verify your session. Please try again.");
  if (!data?.user) redirect("/login");
  return data.user;
}
