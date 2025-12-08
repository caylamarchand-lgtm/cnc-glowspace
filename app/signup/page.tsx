export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-pink-400 mb-6">Create an Account ✨</h1>

      <form className="flex flex-col w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
        />

        <button
          type="submit"
          className="w-full p-3 rounded bg-pink-500 hover:bg-pink-600 transition font-semibold"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center text-gray-400 mt-4">
        <a href="/" className="text-pink-400 hover:underline">
          ← Back to CNC GlowSpace
        </a>
      </div>
    </main>
  );
}