import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /manage routes, but allow /manage/login
  if (pathname.startsWith("/manage") && pathname !== "/manage/login") {
    // With the new proxy pattern running in Node.js, we can use getServerSession directly
    const session = await getServerSession(authOptions);
    
    if (!session) {
      const loginUrl = new URL("/manage/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
