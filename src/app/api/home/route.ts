import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createApiHandler } from "@/lib/api-handler";
import { HomeContentSchema } from "@/lib/validators";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const item = await prisma.homePageContent.findFirst();
    return NextResponse.json(item || {});
  } catch (error) {
    logger.error("homePageContent GET error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export const POST = createApiHandler(async (req, data) => {
  const existing = await prisma.homePageContent.findFirst();
  let item;
  if (existing) {
    item = await prisma.homePageContent.update({ where: { id: existing.id }, data });
  } else {
    item = await prisma.homePageContent.create({ data });
  }
  return NextResponse.json(item);
}, { schema: HomeContentSchema, requireAuth: true });
