import { cookies } from "next/headers";

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return jar.get("admin_session")?.value === "ok";
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}
