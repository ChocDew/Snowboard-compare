# 🏂 Snowboard Compare — Backend API

A Next.js backend API for a snowboard comparison website, ready to deploy on Vercel.

---

## API Endpoints

### `GET /api/snowboards`
Returns all snowboards. Supports filtering and sorting via query params.

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Full-text search on brand, model, description |
| `brand` | string | Filter by brand (case-insensitive) |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `minFlex` | number | Minimum flex rating (1–10) |
| `maxFlex` | number | Maximum flex rating (1–10) |
| `shape` | string | `Twin` \| `Directional` \| `Directional Twin` |
| `terrainType` | string | `All-Mountain` \| `Park` \| `Powder` \| `Groomed` \| `Backcountry` \| `Jib` \| `Race` \| `Beginner` |
| `sortBy` | string | `price_asc` \| `price_desc` \| `flex_asc` \| `flex_desc` \| `brand` |

**Examples:**
```
GET /api/snowboards
GET /api/snowboards?terrainType=Powder&maxPrice=600&sortBy=price_asc
GET /api/snowboards?brand=Burton&minFlex=5
GET /api/snowboards?search=twin
```

---

### `GET /api/snowboards/[id]`
Returns a single snowboard by ID.

```
GET /api/snowboards/1
```

---

### `GET /api/compare?ids=1,2,3`
Compares 2–4 snowboards side by side. Returns structured comparison data including a `winner` field for price (cheapest board).

```
GET /api/compare?ids=1,3,5
GET /api/compare?ids=2,6,9,12
```

---

### `GET /api/filters`
Returns all available filter values derived from the dataset. Use this to populate dropdowns and sliders in your frontend.

---

## Response Shape

All endpoints return:
```json
{
  "success": true,
  "data": { ... }
}
```

On error:
```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

---

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the endpoint index page.

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).

---

## Adding Snowboards

Edit `data/snowboards.json`. Each board follows this shape:

```json
{
  "id": "13",
  "brand": "Your Brand",
  "model": "Model Name",
  "year": 2025,
  "price": 599,
  "flexRating": 5,
  "shape": "Twin",
  "profile": "Camber",
  "terrainType": ["All-Mountain", "Park"],
  "sizes": [150, 153, 156],
  "description": "Short description of the board.",
  "imageUrl": null
}
```

**Flex rating scale:** 1–3 soft, 4–6 medium, 7–10 stiff.

---

## Migrating to a Database

When you're ready to scale beyond JSON, swap the functions in `src/lib/snowboards.ts` to query Vercel Postgres or any external DB — the API routes don't need to change.
