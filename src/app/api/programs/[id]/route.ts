import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createApiHandler } from "@/lib/api-handler";
import { ProgramSchema } from "@/lib/validators";
import { logger } from "@/lib/logger";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const item = await prisma.program.findUnique({ where: { id: id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    logger.error("program GET by ID error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export const PUT = createApiHandler(async (req, data, session, params) => {
  const { id } = params;
  const item = await prisma.program.update({ where: { id }, data });
  return NextResponse.json(item);
}, { schema: ProgramSchema, requireAuth: true });

export const DELETE = createApiHandler(async (req, data, session, params) => {
  const { id } = params;
  await prisma.program.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}, { requireAuth: true });
