import { NextResponse } from "next/server";
import { getAvailableFilters } from "@/lib/snowboards";

/**
 * GET /api/filters
 *
 * Returns all available filter values derived from the current dataset.
 * Use this to populate dropdowns and range sliders on the frontend.
 *
 * Example response:
 * {
 *   "brands": ["Burton", "Capita", ...],
 *   "shapes": ["Directional", "Directional Twin", "Twin"],
 *   "profiles": ["Camber", "Rocker", ...],
 *   "terrainTypes": ["All-Mountain", "Backcountry", ...],
 *   "priceRange": { "min": 399, "max": 749 },
 *   "flexRange": { "min": 3, "max": 8 }
 * }
 */
export async function GET() {
  try {
    const filters = getAvailableFilters();
    return NextResponse.json({ success: true, data: filters });
  } catch (error) {
    console.error("Error in GET /api/filters:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
