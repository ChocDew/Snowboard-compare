export default function Home() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/snowboards",
      description: "List all snowboards. Supports filtering & sorting via query params.",
      params: [
        "search – full-text search",
        "brand – filter by brand",
        "minPrice / maxPrice – price range",
        "minFlex / maxFlex – flex rating range (1–10)",
        "shape – Twin | Directional | Directional Twin",
        "terrainType – All-Mountain | Park | Powder | Groomed | Backcountry | Jib | Race | Beginner",
        "sortBy – price_asc | price_desc | flex_asc | flex_desc | brand",
      ],
    },
    {
      method: "GET",
      path: "/api/snowboards/[id]",
      description: "Get a single snowboard by ID.",
      params: [],
    },
    {
      method: "GET",
      path: "/api/compare?ids=1,2,3",
      description: "Compare 2–4 snowboards side by side. Returns structured comparison with field-level winners.",
      params: ["ids – comma-separated list of snowboard IDs (2–4)"],
    },
    {
      method: "GET",
      path: "/api/filters",
      description: "Get all available filter values (brands, shapes, terrain types, price/flex ranges). Use to populate frontend filter UI.",
      params: [],
    },
  ];

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🏂 Snowboard Compare API</h1>
      <p>All responses follow the shape: <code>{`{ success: boolean, data: ... }`}</code></p>
      <hr />
      {endpoints.map((ep) => (
        <div key={ep.path} style={{ marginBottom: "2rem" }}>
          <p>
            <strong style={{ color: "#0070f3" }}>{ep.method}</strong>{" "}
            <code>{ep.path}</code>
          </p>
          <p style={{ marginLeft: "1rem", color: "#444" }}>{ep.description}</p>
          {ep.params.length > 0 && (
            <ul style={{ marginLeft: "2rem", color: "#666" }}>
              {ep.params.map((p) => (
                <li key={p}><code>{p}</code></li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </main>
  );
}
