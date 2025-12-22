export default function ExplorePage() {
  const tags = ["GlowSpace", "CNC", "Creators", "SmallBusiness", "GlowUp"];

  const creators = [
    {
      id: "creator-spotlight",
      name: "Creator Spotlight",
      bio: "Handmade • Small biz • Glow vibes",
    },
    {
      id: "rising-creator",
      name: "Rising Creator",
      bio: "Art • DIY • Custom everything",
    },
  ];

  const groups = [
    {
      id: "cnc-makers-hub",
      name: "CNC Makers Hub",
      desc: "DTF • vinyl • decals • makers",
    },
    {
      id: "glowspace-lounge",
      name: "GlowSpace Lounge",
      desc: "General chat • vibes • friends",
    },
    {
      id: "small-biz-baddies",
      name: "Small Biz Baddies",
      desc: "Marketing • sales • wins",
    },
    {
      id: "tech-creators",
      name: "Tech Creators",
      desc: "Build • code • ship",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-b from-[#1b1440] via-[#120f2e] to-[#0b1026]">
      <div className="relative mx-auto max-w-4xl">
        {/* Nebula glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-pink-400/30 blur-[120px]" />
        <div className="pointer-events-none absolute top-32 left-6 h-[360px] w-[360px] rounded-full bg-purple-500/30 blur-[120px]" />
        <div className="pointer-events-none absolute top-52 right-6 h-[360px] w-[360px] rounded-full bg-cyan-400/20 blur-[120px]" />

        <div className="relative">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-semibold text-white">Explore</h1>
            <p className="mt-3 text-sm text-white/70">
              Discover trending topics, creators, and communities across GlowSpace.
            </p>
            <p className="mt-2 text-xs text-white/50">
              Clicking items jumps to their preview below (no new pages yet).
            </p>
          </div>

          {/* Trending */}
          <section className="mb-10 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-semibold text-white">Trending</h2>
            <div className="flex flex-wrap gap-3">
              {tags.map((t) => (
                <a
                  key={t}
                  href={`#topic-${t.toLowerCase()}`}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white
                             hover:border-pink-300/60 hover:bg-pink-400/20 transition"
                >
                  #{t}
                </a>
              ))}
            </div>
          </section>

          {/* Featured Creators */}
          <section className="mb-10 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Featured Creators
            </h2>

            <div className="space-y-4">
              {creators.map((c) => (
                <a
                  key={c.id}
                  href={`#creator-${c.id}`}
                  className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-4
                             hover:border-purple-300/40 transition"
                >
                  <div>
                    <div className="font-medium text-white">{c.name}</div>
                    <div className="text-xs text-white/60">{c.bio}</div>
                  </div>
                  <span className="text-sm text-white/70">View</span>
                </a>
              ))}
            </div>
          </section>

          {/* Groups */}
          <section className="mb-14 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Groups & Spaces
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {groups.map((g) => (
                <a
                  key={g.id}
                  href={`#group-${g.id}`}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4
                             hover:border-cyan-300/40 transition"
                >
                  <div className="font-medium text-white">{g.name}</div>
                  <div className="text-xs text-white/60">{g.desc}</div>
                </a>
              ))}
            </div>
          </section>

          {/* PREVIEWS */}
          <section className="space-y-10">
            {/* Topic previews */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">Topic Hubs</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {tags.map((t) => (
                  <div
                    key={t}
                    id={`topic-${t.toLowerCase()}`}
                    className="scroll-mt-24 rounded-2xl border border-white/20 bg-white/10 p-5"
                  >
                    <div className="font-semibold text-white">#{t}</div>
                    <div className="mt-2 text-sm text-white/70">
                      Topic hub preview (posts, creators, groups later).
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator previews */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Creator Previews
              </h2>
              <div className="space-y-4">
                {creators.map((c) => (
                  <div
                    key={c.id}
                    id={`creator-${c.id}`}
                    className="scroll-mt-24 rounded-2xl border border-white/20 bg-white/10 p-5"
                  >
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-sm text-white/70">{c.bio}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group previews */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Group Previews
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {groups.map((g) => (
                  <div
                    key={g.id}
                    id={`group-${g.id}`}
                    className="scroll-mt-24 rounded-2xl border border-white/20 bg-white/10 p-5"
                  >
                    <div className="font-semibold text-white">{g.name}</div>
                    <div className="text-sm text-white/70">{g.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-12 text-center text-xs text-white/50">
            No routing. No 404s. No broken builds. Just previews.
          </div>
        </div>
      </div>
    </main>
  );
}