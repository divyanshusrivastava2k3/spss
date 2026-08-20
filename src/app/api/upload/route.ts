import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logger } from "@/lib/logger";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/x-icon", "application/pdf"];
const MAX_UPLOAD_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE || "157286400", 10); // increased max upload size to 150MB

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      logger.warn("Unauthorized upload attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseUrl || !supabaseKey) {
      logger.error("Supabase credentials not configured");
      return NextResponse.json({ error: "Storage not configured on server." }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      logger.warn(`Invalid file type upload attempt: ${file.type}`);
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WEBP, ICO, and PDF are allowed." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      logger.warn(`File too large: ${file.size} bytes`);
      return NextResponse.json({ error: `File size exceeds the limit of ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.` }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and use crypto.randomUUID
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = originalName.split(".").pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      logger.error("Supabase storage upload error:", error);
      return NextResponse.json({ error: "Failed to upload to cloud storage." }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    logger.info(`File uploaded successfully to Supabase: ${fileName}`);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      filename: fileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    logger.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
