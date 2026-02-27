import { NextRequest, NextResponse } from "next/server";
import { mockApiResponse } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check if we should use mock data (for POC)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

    if (useMockData) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Return mock data with the actual filename
      return NextResponse.json({
        ...(mockApiResponse as Record<string, unknown>),
        file_name: file.name,
      });
    }

    // TODO: Replace with actual backend URL when ready
    const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: data.status,
      output_parsed: data.output_parsed,
      file_name: data.file_name,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    // Fallback to mock data in development
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(mockApiResponse as unknown);
    }

    return NextResponse.json(
      { error: "Failed to analyze document" },
      { status: 500 }
    );
  }
}
