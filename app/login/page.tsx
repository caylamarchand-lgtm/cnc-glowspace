import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-pink-400">Welcome Back ✨</h1>

      <p className="text-lg text-gray-300 mb-8 text-center">
        Log in to your glowing universe.
      </p>

      <form action="/profile" method="GET" className="flex flex-col w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded bg-gray-800 text-white border border-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded bg-gray-800 text-white border border-gray-700"
        />

        <Link href="/profile">
  <button
    type="button"
    className="w-full p-3 rounded bg-pink-500 hover:bg-pink-600 transition font-semibold"
  >
    Log In
  </button>
</Link>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Don’t have an account?
        </p>

        <Link href="/" className="text-pink-400 hover:underline mt-2 block">
          ← Back to CNC GlowSpace
        </Link>
      </div>
    </main>
  );
}