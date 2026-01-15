"use client";

import Link from "next/link";

export default function GlowSpacePage() {
  return (
    <main className="min-h-screen relative overflow-hidden text-slate-100">
      {/* base background */}
      <div className="absolute inset-0 bg-[#050814]" />

      {/* soft animated glow */}
      <div className="absolute inset-0 opacity-80">
        <div className="absolute -inset-[40%] blur-3xl animate-[glowDrift_22s_ease-in-out_infinite] bg-[radial-gradient(circle_at_20%_30%,rgba(255,180,220,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(160,210,255,0.16),transparent_55%),radial-gradient(circle_at_50%_80%,rgba(120,255,210,0.10),transparent_60%)]" />
      </div>

      {/* floating hearts background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="hearts hearts-slow" />
        <div className="hearts hearts-fast" />
      </div>

      {/* content */}
      <div className="relative z-10 px-6 py-16 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl border border-white/10 bg-[#0b1020]/70 backdrop-blur-md shadow-[0_0_50px_rgba(140,170,255,0.10)] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,180,220,0.15)] grid place-items-center">
                ✨
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-pink-200 drop-shadow-[0_0_12px_rgba(236,72,153,0.25)]">
                  You belong here.
                </h1>
                <p className="text-slate-200/80 text-sm md:text-base">
                  GlowSpace is a place you don’t have to perform to exist.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-slate-100/85 leading-relaxed">
              <p>• You don’t have to post.</p>
              <p>• You don’t have to grow.</p>
              <p>• You don’t have to be loud.</p>
              <p className="pt-2 text-slate-200/80">
                Your presence matters — even in silence.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-slate-200/85 text-sm">
                Today’s vibe:
                <span className="text-pink-200 font-semibold">
                  {" "}
                  slow breaths, soft glow, safe space.
                </span>
              </p>
              <p className="text-slate-300/70 text-xs mt-1">
                Tip: tap “Create” when you’re ready — even if it’s just a tiny post.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/feed"
                className="text-center rounded-2xl px-5 py-3 font-semibold bg-pink-500/25 border border-pink-300/20 hover:bg-pink-500/35 transition shadow-[0_0_24px_rgba(236,72,153,0.15)]"
              >
                Explore the Feed
              </Link>

              <Link
                href="/create"
                className="text-center rounded-2xl px-5 py-3 font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Create something
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-300/60">
              GlowSpace will still be here whenever you come back.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glowDrift {
          0% {
            transform: translate3d(-1%, -1%, 0) scale(1);
          }
          50% {
            transform: translate3d(1.5%, 1%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(-1%, -1%, 0) scale(1);
          }
        }

        /* ❤️ floating hearts layer */
        .hearts {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='rgba(255,180,220,0.45)'%3E%3Cpath d='M12 21s-7.5-4.6-10-8.7C-0.2 8.2 2.4 4 6.5 4c2.1 0 3.4 1.2 4.1 2.3C11.1 5.2 12.4 4 14.5 4 18.6 4 21.2 8.2 22 12.3 19.5 16.4 12 21 12 21z'/%3E%3C/svg%3E");
          background-size: 42px 42px;
          opacity: 0.35;
          animation: floatHearts 90s linear infinite;
        }

        .hearts-slow {
          animation-duration: 40s;
        }

        .hearts-fast {
          animation-duration: 24s;
          opacity: 0.25;
          filter: blur(0.6px);
        }
@keyframes floatHearts {
  0% {
    transform: translateY(2%);
    opacity: 0.25;
  }
  50% {
    transform: translateY(-2%);
    opacity: 0.35;
  }
  100% {
    transform: translateY(2%);
    opacity: 0.25;
  }
}
      `}</style>
    </main>
  );
}