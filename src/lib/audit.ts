import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function logAudit(action: string, detail?: string) {
  try {
    await prisma.auditLog.create({
      data: { id: crypto.randomUUID(), action, detail: detail || null },
    });
  } catch {
    // ignore logging errors
  }
}
