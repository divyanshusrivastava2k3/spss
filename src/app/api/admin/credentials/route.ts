import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    if (username.length < 3 || password.length < 6) {
      return NextResponse.json({ error: "Username must be at least 3 characters and password at least 6 characters" }, { status: 400 });
    }

    // Get the current user to find their ID (using the session name which stores the username)
    const currentUser = await prisma.adminUser.findUnique({
      where: { username: session.user.name },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update credentials
    await prisma.adminUser.update({
      where: { id: currentUser.id },
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    logger.info(`Admin user credentials updated for: ${username}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Failed to update credentials:", error);
    return NextResponse.json({ error: "Failed to update credentials" }, { status: 500 });
  }
}
