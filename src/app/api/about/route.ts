import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createApiHandler } from "@/lib/api-handler";
import { AboutContentSchema } from "@/lib/validators";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const item = await prisma.aboutPageContent.findFirst();
    return NextResponse.json(item || {});
  } catch (error) {
    logger.error("aboutPageContent GET error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export const POST = createApiHandler(async (req, data) => {
  const existing = await prisma.aboutPageContent.findFirst();
  let item;
  if (existing) {
    item = await prisma.aboutPageContent.update({ where: { id: existing.id }, data });
  } else {
    item = await prisma.aboutPageContent.create({ data });
  }
  return NextResponse.json(item);
}, { schema: AboutContentSchema, requireAuth: true });
