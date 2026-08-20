import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logger } from "@/lib/logger";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
    }

    // Sanitize filename and use crypto.randomUUID
    const originalName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = originalName.split(".").pop();
    const newFileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUploadUrl(newFileName);

    if (error || !data) {
      logger.error("Supabase createSignedUploadUrl error:", error);
      return NextResponse.json({ error: "Failed to create signed upload URL." }, { status: 500 });
    }

    // Get the public URL for future use (Supabase predictable URL)
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(newFileName);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      supabaseUrl: supabaseUrl
    });
  } catch (error) {
    logger.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
