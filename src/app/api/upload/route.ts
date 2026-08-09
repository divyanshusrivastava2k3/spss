import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logger } from "@/lib/logger";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/x-icon"];
const MAX_UPLOAD_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE || "5242880", 10);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      logger.warn("Unauthorized upload attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      logger.warn(`Invalid file type upload attempt: ${file.type}`);
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WEBP, and ICO are allowed." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      logger.warn(`File too large: ${file.size} bytes`);
      return NextResponse.json({ error: `File size exceeds the limit of ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.` }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and use crypto.randomUUID for security against path traversal
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = originalName.split(".").pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, fileName);

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    await writeFile(filePath, buffer);

    logger.info(`File uploaded successfully: ${fileName}`);

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      filename: fileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    logger.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
