import { NextRequest, NextResponse } from "next/server";
import { getSnowboardById } from "@/lib/snowboards";

/**
 * GET /api/snowboards/[id]
 *
 * Returns a single snowboard by ID.
 *
 * Example:
 *   GET /api/snowboards/1
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const snowboard = getSnowboardById(id);

    if (!snowboard) {
      return NextResponse.json(
        { success: false, error: `Snowboard with id "${id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: snowboard });
  } catch (error) {
    console.error(`Error in GET /api/snowboards/${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
