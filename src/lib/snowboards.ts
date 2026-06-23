import snowboardData from "../../data/snowboards.json";

export type TerrainType =
  | "All-Mountain"
  | "Park"
  | "Powder"
  | "Groomed"
  | "Backcountry"
  | "Jib"
  | "Race"
  | "Beginner";

export type Profile =
  | "Camber"
  | "Rocker"
  | "Flat"
  | "Flying V (Rocker/Camber)"
  | "C2 (Camber/Rocker)"
  | "Rocker (Banana)"
  | "Rocker/Flat"
  | "Rocker/Camber (STS)"
  | "Flat/Camber";

export type Shape =
  | "Twin"
  | "Directional"
  | "Directional Twin";

export interface Snowboard {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  flexRating: number; // 1–10 scale
  shape: Shape;
  profile: Profile;
  terrainType: TerrainType[];
  sizes: number[];
  description: string;
  imageUrl: string | null;
}

export interface SnowboardFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minFlex?: number;
  maxFlex?: number;
  shape?: Shape;
  terrainType?: TerrainType;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "flex_asc" | "flex_desc" | "brand";
}

const snowboards: Snowboard[] = snowboardData as Snowboard[];

export function getAllSnowboards(): Snowboard[] {
  return snowboards;
}

export function getSnowboardById(id: string): Snowboard | undefined {
  return snowboards.find((b) => b.id === id);
}

export function getSnowboardsByIds(ids: string[]): Snowboard[] {
  return ids
    .map((id) => snowboards.find((b) => b.id === id))
    .filter((b): b is Snowboard => b !== undefined);
}

export function filterSnowboards(filters: SnowboardFilters): Snowboard[] {
  let results = [...snowboards];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (b) =>
        b.brand.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }

  if (filters.brand) {
    results = results.filter(
      (b) => b.brand.toLowerCase() === filters.brand!.toLowerCase()
    );
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((b) => b.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((b) => b.price <= filters.maxPrice!);
  }

  if (filters.minFlex !== undefined) {
    results = results.filter((b) => b.flexRating >= filters.minFlex!);
  }

  if (filters.maxFlex !== undefined) {
    results = results.filter((b) => b.flexRating <= filters.maxFlex!);
  }

  if (filters.shape) {
    results = results.filter((b) => b.shape === filters.shape);
  }

  if (filters.terrainType) {
    results = results.filter((b) =>
      b.terrainType.includes(filters.terrainType!)
    );
  }

  // Sorting
  switch (filters.sortBy) {
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "flex_asc":
      results.sort((a, b) => a.flexRating - b.flexRating);
      break;
    case "flex_desc":
      results.sort((a, b) => b.flexRating - a.flexRating);
      break;
    case "brand":
      results.sort((a, b) =>
        `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
      );
      break;
    default:
      results.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }

  return results;
}

export function getAvailableFilters() {
  const brands = [...new Set(snowboards.map((b) => b.brand))].sort();
  const shapes = [...new Set(snowboards.map((b) => b.shape))].sort();
  const profiles = [...new Set(snowboards.map((b) => b.profile))].sort();
  const terrainTypes = [
    ...new Set(snowboards.flatMap((b) => b.terrainType)),
  ].sort();
  const priceRange = {
    min: Math.min(...snowboards.map((b) => b.price)),
    max: Math.max(...snowboards.map((b) => b.price)),
  };
  const flexRange = {
    min: Math.min(...snowboards.map((b) => b.flexRating)),
    max: Math.max(...snowboards.map((b) => b.flexRating)),
  };

  return { brands, shapes, profiles, terrainTypes, priceRange, flexRange };
}
