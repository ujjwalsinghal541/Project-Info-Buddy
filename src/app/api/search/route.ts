import { NextResponse } from "next/server";
import { discoverTopic } from "@/services/discoveryService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query is required and cannot be empty" },
        { status: 400 }
      );
    }

    const result = await discoverTopic(query);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create discovery topic" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        topicId: result.id,
        status: "success",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Search Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
