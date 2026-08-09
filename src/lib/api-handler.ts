import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { rateLimit } from "./rate-limit";
import { validateBody } from "./validators";
import { logger } from "./logger";
import { ZodSchema } from "zod";

interface ApiHandlerOptions<T> {
  schema?: ZodSchema<T>;
  requireAuth?: boolean;
}

export function createApiHandler<T>(
  handler: (req: Request, data: T, session: Session | null, params: Record<string, string>) => Promise<NextResponse>,
  options: ApiHandlerOptions<T> = {}
) {
  return async function(req: Request, context?: { params: Promise<Record<string, string>> | Record<string, string> }) {
    const params = context?.params ? await context.params : {};
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const rateLimitResult = rateLimit(ip);

    if (!rateLimitResult.success) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": rateLimitResult.resetTime.toString() },
      });
    }

    // CSRF Protection for mutating methods
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
      const origin = req.headers.get("origin") || req.headers.get("referer");
      const host = req.headers.get("host");
      if (origin && host) {
        try {
          const originUrl = new URL(origin);
          if (originUrl.host !== host) {
            logger.warn(`CSRF failed: Origin ${originUrl.host} does not match Host ${host}`);
            return NextResponse.json({ error: "Invalid Origin" }, { status: 403 });
          }
        } catch (e) {
          // Invalid URL
        }
      }
    }

    let session: Session | null = null;
    if (options.requireAuth !== false) {
      session = await getServerSession(authOptions);
      if (!session) {
        logger.warn(`Unauthorized access attempt from IP: ${ip}`);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    let parsedData: T | null = null;
    if (options.schema && req.method !== "GET" && req.method !== "DELETE") {
      try {
        const body = await req.json();
        const validation = validateBody(options.schema, body);
        if (!validation.success) {
          logger.warn(`Validation failed for ${req.url}`, validation.errors);
          return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
        }
        parsedData = validation.data;
      } catch (error) {
        logger.error(`Error parsing JSON body for ${req.url}`, error);
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
    }

    try {
      return await handler(req, parsedData as T, session, params as Record<string, string>);
    } catch (error: any) {
      logger.error(`API Error in ${req.url}:`, error);

      // Prisma error handling
      if (error.code === 'P2002') {
        return NextResponse.json({ error: "Unique constraint failed" }, { status: 409 });
      }
      if (error.code === 'P2003') {
        return NextResponse.json({ error: "Foreign key constraint failed" }, { status: 400 });
      }
      if (error.code === 'P2025') {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }

      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}
