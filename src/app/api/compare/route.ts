import { NextRequest, NextResponse } from "next/server";
import { getSnowboardsByIds, Snowboard } from "@/lib/snowboards";

interface ComparisonField {
  label: string;
  key: keyof Snowboard;
  values: Record<string, unknown>;
  winner?: string | null; // id of the "best" board for this field, if applicable
}

function buildComparison(boards: Snowboard[]) {
  const fields: ComparisonField[] = [
    {
      label: "Brand & Model",
      key: "brand",
      values: Object.fromEntries(boards.map((b) => [b.id, `${b.brand} ${b.model}`])),
    },
    {
      label: "Price (AUD)",
      key: "price",
      values: Object.fromEntries(boards.map((b) => [b.id, `$${b.price}`])),
      winner: boards.reduce((a, b) => (a.price < b.price ? a : b)).id,
    },
    {
      label: "Flex Rating (1–10)",
      key: "flexRating",
      values: Object.fromEntries(boards.map((b) => [b.id, b.flexRating])),
    },
    {
      label: "Shape",
      key: "shape",
      values: Object.fromEntries(boards.map((b) => [b.id, b.shape])),
    },
    {
      label: "Profile",
      key: "profile",
      values: Object.fromEntries(boards.map((b) => [b.id, b.profile])),
    },
    {
      label: "Terrain Type",
      key: "terrainType",
      values: Object.fromEntries(
        boards.map((b) => [b.id, b.terrainType.join(", ")])
      ),
    },
    {
      label: "Available Sizes (cm)",
      key: "sizes",
      values: Object.fromEntries(
        boards.map((b) => [b.id, b.sizes.join(", ")])
      ),
    },
    {
      label: "Year",
      key: "year",
      values: Object.fromEntries(boards.map((b) => [b.id, b.year])),
    },
  ];

  return {
    boards: boards.map((b) => ({
      id: b.id,
      name: `${b.brand} ${b.model}`,
      description: b.description,
    })),
    fields,
  };
}

/**
 * GET /api/compare?ids=1,2,3
 *
 * Compares 2–4 snowboards side by side.
 * Returns structured comparison data with field-level winners.
 *
 * Query params:
 *   ids - comma-separated list of snowboard IDs (2–4 required)
 *
 * Example:
 *   GET /api/compare?ids=1,3,5
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { success: false, error: "Query param 'ids' is required (comma-separated)" },
        { status: 400 }
      );
    }

    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length < 2) {
      return NextResponse.json(
        { success: false, error: "At least 2 snowboard IDs are required for comparison" },
        { status: 400 }
      );
    }

    if (ids.length > 4) {
      return NextResponse.json(
        { success: false, error: "Maximum 4 snowboards can be compared at once" },
        { status: 400 }
      );
    }

    const boards = getSnowboardsByIds(ids);

    const notFound = ids.filter((id) => !boards.find((b) => b.id === id));
    if (notFound.length > 0) {
      return NextResponse.json(
        { success: false, error: `Snowboard(s) not found: ${notFound.join(", ")}` },
        { status: 404 }
      );
    }

    const comparison = buildComparison(boards);

    return NextResponse.json({ success: true, data: comparison });
  } catch (error) {
    console.error("Error in GET /api/compare:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
