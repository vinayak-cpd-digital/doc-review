import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        { error: "No file path provided" },
        { status: 400 }
      );
    }

    // Normalize the path (handle backslashes from Windows paths)
    const normalizedPath = filePath.replace(/\\/g, "/");

    // In production, files would be served from a backend folder.
    // For now (mock), serve from the public folder.
    const fullPath = path.join(process.cwd(), "public", normalizedPath);

    // Security: ensure the resolved path is within the public directory
    const resolvedPath = path.resolve(fullPath);
    const publicDir = path.resolve(path.join(process.cwd(), "public"));
    if (!resolvedPath.startsWith(publicDir)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const fileBuffer = await readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();

    // Determine content type
    const contentTypeMap: Record<string, string> = {
      ".txt": "text/plain",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
    };

    const contentType = contentTypeMap[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${path.basename(resolvedPath)}"`,
      },
    });
  } catch (error) {
    console.error("Serve file error:", error);
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }
}
