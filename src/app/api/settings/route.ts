import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createApiHandler } from "@/lib/api-handler";
import { SettingsSchema } from "@/lib/validators";
import { logger } from "@/lib/logger";

import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    logger.error("Settings GET error", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export const POST = createApiHandler(async (req, data) => {
  const settings = await prisma.settings.findFirst();

  let updatedSettings;
  if (settings) {
    updatedSettings = await prisma.settings.update({
      where: { id: settings.id },
      data,
    });
  } else {
    updatedSettings = await prisma.settings.create({
      data,
    });
  }

  revalidatePath("/", "layout");

  return NextResponse.json(updatedSettings);
}, { schema: SettingsSchema, requireAuth: true });