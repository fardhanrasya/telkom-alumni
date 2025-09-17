import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { revalidationManager } from "@/lib/revalidation-manager";
import { webhookLogger, securityLogger, performanceLogger } from "@/lib/logger";
import { validateWebhookRequest, isAllowedIP } from "@/lib/validation";

// Sanity webhook payload interface
interface SanityWebhookPayload {
  _type: string;
  _id: string;
  _rev?: string;
  slug?: {
    current: string;
  };
  category?: string;
  operation?: "create" | "update" | "delete";
}

// Response interface
interface RevalidateResponse {
  revalidated: boolean;
  paths: string[];
  timestamp: number;
  error?: string;
}

// Verify webhook signature from Sanity
function verifySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    // Sanity sends signature as "sha256=<hash>"
    const receivedSignature = signature.replace("sha256=", "");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(receivedSignature, "hex")
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

// Generate paths that need revalidation based on the gallery change
function generateRevalidationPaths(payload: SanityWebhookPayload): string[] {
  const paths: string[] = [];

  // Always revalidate main gallery page
  paths.push("/galeri");

  // If we have a slug, revalidate the specific gallery page
  if (payload.slug?.current) {
    paths.push(`/galeri/${payload.slug.current}`);
  }

  // Revalidate home page if it shows featured galleries
  paths.push("/");

  // Add API routes that might cache gallery data
  paths.push("/api/gallery");

  return paths;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  try {
    // Validate IP address
    if (!isAllowedIP(clientIP)) {
      securityLogger.event("Request from invalid IP", { ip: clientIP });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Apply rate limiting

    // Check if webhook secret is configured
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      webhookLogger.error("SANITY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Get the raw body for signature verification
    const body = await request.text();

    // Validate the entire request
    const validation = validateWebhookRequest(request.headers, body);
    if (!validation.isValid) {
      webhookLogger.error("Request validation failed", {
        errors: validation.errors,
        ip: clientIP,
      });
      return NextResponse.json(
        { error: "Invalid request", details: validation.errors },
        { status: 400 }
      );
    }

    // Get signature from headers (already validated)
    const signature = request.headers.get("sanity-webhook-signature")!;

    // Verify webhook signature
    if (!verifySignature(body, signature, webhookSecret)) {
      // Apply signature-specific rate limiting for failed attempts
      securityLogger.invalidSignature(signature, clientIP);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Use the sanitized payload from validation
    const payload = validation.sanitizedData as SanityWebhookPayload;
    webhookLogger.received(payload, signature);

    // Validate that this is a gallery document
    if (payload._type !== "gallery") {
      webhookLogger.error("Ignoring non-gallery document", {
        type: payload._type,
        id: payload._id,
      });
      return NextResponse.json({
        revalidated: false,
        paths: [],
        timestamp: Date.now(),
        error: "Not a gallery document",
      } as RevalidateResponse);
    }

    // Use revalidation manager for intelligent path handling
    const revalidationResults =
      await revalidationManager.revalidateGalleryPages(
        payload._id,
        payload.slug?.current
      );

    // Also handle category-specific revalidation if needed
    if (payload.category) {
      const categoryResults = await revalidationManager.revalidateByCategory(
        payload.category
      );
      revalidationResults.push(...categoryResults);
    }

    const errors: string[] = [];

    // Log successful processing
    const result = {
      paths: revalidationResults,
      errors: errors.length > 0 ? errors : undefined,
    };
    webhookLogger.processed(payload, result);

    // Log performance metrics
    const duration = Date.now() - startTime;
    performanceLogger.metric("webhook_processing", duration, {
      pathCount: revalidationResults.length,
      hasErrors: errors.length > 0,
    });

    // Return response
    const response: RevalidateResponse = {
      revalidated: revalidationResults.length > 0,
      paths: revalidationResults,
      timestamp: Date.now(),
      error: errors.length > 0 ? errors.join("; ") : undefined,
    };

    return NextResponse.json(response, {
      status: errors.length > 0 ? 207 : 200, // 207 Multi-Status if partial success
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    webhookLogger.error("Webhook processing failed", {
      error: String(error),
      duration,
    });

    return NextResponse.json(
      {
        revalidated: false,
        paths: [],
        timestamp: Date.now(),
        error: "Internal server error",
      } as RevalidateResponse,
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
