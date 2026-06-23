import { NextRequest, NextResponse } from "next/server";
import {
  filterSnowboards,
  getAllSnowboards,
  SnowboardFilters,
  Shape,
  TerrainType,
} from "@/lib/snowboards";

/**
 * GET /api/snowboards
 *
 * Returns all snowboards, optionally filtered and sorted.
 *
 * Query params:
 *   search        - string: full-text search on brand, model, description
 *   brand         - string: filter by brand name (case-insensitive)
 *   minPrice      - number: minimum price
 *   maxPrice      - number: maximum price
 *   minFlex       - number (1–10): minimum flex rating
 *   maxFlex       - number (1–10): maximum flex rating
 *   shape         - "Twin" | "Directional" | "Directional Twin"
 *   terrainType   - e.g. "All-Mountain" | "Park" | "Powder" | ...
 *   sortBy        - "price_asc" | "price_desc" | "flex_asc" | "flex_desc" | "brand"
 *
 * Example:
 *   GET /api/snowboards?terrainType=Powder&maxPrice=600&sortBy=price_asc
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const hasFilters = searchParams.toString().length > 0;

    if (!hasFilters) {
      return NextResponse.json({
        success: true,
        count: getAllSnowboards().length,
        data: getAllSnowboards(),
      });
    }

    const filters: SnowboardFilters = {};

    const search = searchParams.get("search");
    if (search) filters.search = search;

    const brand = searchParams.get("brand");
    if (brand) filters.brand = brand;

    const minPrice = searchParams.get("minPrice");
    if (minPrice) {
      const val = parseFloat(minPrice);
      if (isNaN(val)) {
        return NextResponse.json(
          { success: false, error: "minPrice must be a number" },
          { status: 400 }
        );
      }
      filters.minPrice = val;
    }

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) {
      const val = parseFloat(maxPrice);
      if (isNaN(val)) {
        return NextResponse.json(
          { success: false, error: "maxPrice must be a number" },
          { status: 400 }
        );
      }
      filters.maxPrice = val;
    }

    const minFlex = searchParams.get("minFlex");
    if (minFlex) {
      const val = parseInt(minFlex);
      if (isNaN(val) || val < 1 || val > 10) {
        return NextResponse.json(
          { success: false, error: "minFlex must be a number between 1 and 10" },
          { status: 400 }
        );
      }
      filters.minFlex = val;
    }

    const maxFlex = searchParams.get("maxFlex");
    if (maxFlex) {
      const val = parseInt(maxFlex);
      if (isNaN(val) || val < 1 || val > 10) {
        return NextResponse.json(
          { success: false, error: "maxFlex must be a number between 1 and 10" },
          { status: 400 }
        );
      }
      filters.maxFlex = val;
    }

    const shape = searchParams.get("shape") as Shape | null;
    if (shape) {
      const validShapes: Shape[] = ["Twin", "Directional", "Directional Twin"];
      if (!validShapes.includes(shape)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid shape. Must be one of: ${validShapes.join(", ")}`,
          },
          { status: 400 }
        );
      }
      filters.shape = shape;
    }

    const terrainType = searchParams.get("terrainType") as TerrainType | null;
    if (terrainType) {
      const validTerrain: TerrainType[] = [
        "All-Mountain",
        "Park",
        "Powder",
        "Groomed",
        "Backcountry",
        "Jib",
        "Race",
        "Beginner",
      ];
      if (!validTerrain.includes(terrainType)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid terrainType. Must be one of: ${validTerrain.join(", ")}`,
          },
          { status: 400 }
        );
      }
      filters.terrainType = terrainType;
    }

    const sortBy = searchParams.get("sortBy") as SnowboardFilters["sortBy"];
    if (sortBy) {
      const validSorts = ["price_asc", "price_desc", "flex_asc", "flex_desc", "brand"];
      if (!validSorts.includes(sortBy)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid sortBy. Must be one of: ${validSorts.join(", ")}`,
          },
          { status: 400 }
        );
      }
      filters.sortBy = sortBy;
    }

    const results = filterSnowboards(filters);

    return NextResponse.json({
      success: true,
      count: results.length,
      filters: filters,
      data: results,
    });
  } catch (error) {
    console.error("Error in GET /api/snowboards:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
