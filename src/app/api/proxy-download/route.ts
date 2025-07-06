import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, filename, type } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the file server-side to avoid CORS issues
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
    }

    // Get the file content
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine content type based on file type
    let contentType = "application/octet-stream";
    if (type === "video") {
      contentType = "video/mp4";
    } else if (type === "audio") {
      contentType = "audio/mpeg";
    }

    // Return the file as a downloadable response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Proxy download error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to download file",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename");
    const type = searchParams.get("type");

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch the file server-side to avoid CORS issues
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://www.tiktok.com/",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`
      );
    }

    // Get the file content
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine content type based on file type
    let contentType = "application/octet-stream";
    if (type === "video") {
      contentType = "video/mp4";
    } else if (type === "audio") {
      contentType = "audio/mpeg";
    }

    // Return the file as a downloadable response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${
          filename || "download"
        }"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Proxy download error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to download file",
        success: false,
      },
      { status: 500 }
    );
  }
}
