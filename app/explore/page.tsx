export default function ExplorePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Explore</h1>
      <p>Find posts, creators, and tags. (We’ll wire this up next.)</p>

      <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem", maxWidth: "700px" }}>
        <section>
          <h2 style={{ marginBottom: ".5rem" }}>Trending</h2>
          <ul>
            <li>#GlowSpace</li>
            <li>#CNC</li>
            <li>#Creators</li>
          </ul>
        </section>

        <section>
          <h2 style={{ marginBottom: ".5rem" }}>Featured Creators</h2>
          <ul>
            <li>⭐ Coming soon</li>
            <li>⭐ Coming soon</li>
          </ul>
        </section>
      </div>
    </main>
  );
}