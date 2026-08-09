import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createApiHandler } from "@/lib/api-handler";
import { DirectorMessageSchema } from "@/lib/validators";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const items = await prisma.directorMessage.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(items);
  } catch (error) {
    logger.error("directorMessage GET error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export const POST = createApiHandler(async (req, data) => {
  const item = await prisma.directorMessage.create({ data });
  return NextResponse.json(item);
}, { schema: DirectorMessageSchema, requireAuth: true });
