export default function GlowSpacePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-[#1c144a] via-[#120f2e] to-[#0b1026]">
      <div className="relative w-full max-w-2xl text-center">
        {/* cosmic glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-pink-400/25 blur-[140px]" />
        <div className="pointer-events-none absolute top-24 -left-20 h-[360px] w-[360px] rounded-full bg-purple-500/25 blur-[140px]" />
        <div className="pointer-events-none absolute top-40 -right-20 h-[360px] w-[360px] rounded-full bg-cyan-400/20 blur-[140px]" />

        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white">You belong here.</h1>

          <div className="mt-6 space-y-4 text-sm text-white/75 leading-relaxed">
            <p>GlowSpace is a place where you don’t have to perform to exist.</p>

            <p>
              You don’t have to post.
              <br />
              You don’t have to grow.
              <br />
              You don’t have to be loud.
            </p>

            <p>Your presence matters — even in silence.</p>

            <p>
              Whether you’re creating, resting, observing, or just passing through,
              there is space for you here.
            </p>

            <p className="text-white/60">
              Take your time.
              <br />
              GlowSpace will still be here.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}