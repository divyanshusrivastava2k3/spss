import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("Spss@2024", 10);
    await prisma.adminUser.upsert({
      where: { email: "admin@spss.org" },
      update: {},
      create: {
        email: "admin@spss.org",
        username: "admin",
        password: hashedPassword,
      },
    });

    const settingsCount = await prisma.settings.count();
    if (settingsCount === 0) {
      await prisma.settings.create({
        data: {}
      });
    }

    return NextResponse.json({ success: true, message: "Admin and Default Settings seeded" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
