import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createApiHandler } from "@/lib/api-handler";
import { TeamMemberSchema } from "@/lib/validators";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const items = await prisma.teamMember.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(items);
  } catch (error) {
    logger.error("teamMember GET error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export const POST = createApiHandler(async (req, data) => {
  const item = await prisma.teamMember.create({ data });
  return NextResponse.json(item);
}, { schema: TeamMemberSchema, requireAuth: true });
