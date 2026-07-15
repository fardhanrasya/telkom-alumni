import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Secret untuk keamanan webhook
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
  try {
    // Verifikasi secret key
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${REVALIDATE_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, slug, action } = body;

    console.log("Revalidation request:", { type, slug, action });

    // Revalidate berdasarkan tipe konten
    switch (type) {
      case "gallery":
        // Revalidate halaman galeri utama
        await revalidatePath("/galeri");

        // Revalidate halaman detail galeri jika ada slug
        if (slug) {
          await revalidatePath(`/galeri/${slug}`);
        }

        // Revalidate tag untuk cache API
        revalidateTag("galleries");
        break;

      case "news":
        await revalidatePath("/berita");
        if (slug) {
          await revalidatePath(`/berita/${slug}`);
        }
        revalidateTag("news");
        break;

      case "alumni":
        await revalidatePath("/alumni");
        if (slug) {
          await revalidatePath(`/alumni/${slug}`);
        }
        revalidateTag("alumni");
        break;

      case "event":
        await revalidatePath("/acara");
        if (slug) {
          await revalidatePath(`/acara/${slug}`);
        }
        revalidateTag("events");
        break;

      case "job":
        await revalidatePath("/karir");
        if (slug) {
          await revalidatePath(`/karir/${slug}`);
        }
        revalidateTag("jobs");
        break;

      case "homepage":
        // Revalidate homepage dan halaman terkait
        await revalidatePath("/");
        await revalidatePath("/tentang");
        revalidateTag("homepage");
        break;

      default:
        return NextResponse.json(
          { error: "Invalid content type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      revalidated: true,
      type,
      slug,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Error revalidating", details: error },
      { status: 500 }
    );
  }
}

// GET endpoint untuk testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path");

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json({ error: "Path required" }, { status: 400 });
  }

  try {
    await revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error revalidating", details: error },
      { status: 500 }
    );
  }
}
