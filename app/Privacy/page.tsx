export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-200">
      <h1 className="text-3xl font-extrabold text-pink-300">
        Privacy Policy
      </h1>

      <p className="mt-2 text-sm text-slate-400">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mt-8 space-y-4">
        <p>
          This Privacy Policy explains how GlowSpace collects, uses, and protects
          your information when you use the platform.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          1. Information We Collect
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-slate-300">
          <li>Email address and account credentials</li>
          <li>Username, display name, and profile information</li>
          <li>Content you post on GlowSpace</li>
          <li>Basic technical data (IP address, browser/device info)</li>
        </ul>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-slate-300">
          <li>To create and manage your account</li>
          <li>To operate and improve GlowSpace</li>
          <li>To enforce our Terms of Service</li>
          <li>To maintain platform safety and security</li>
        </ul>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          3. Data Sharing
        </h2>
        <p>
          GlowSpace does not sell your personal information. We may share limited
          data with trusted service providers (such as hosting and authentication
          services) only as necessary to operate the platform.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          4. 18+ Only Platform
        </h2>
        <p>
          GlowSpace is an <strong>18+ only platform</strong>. We do not knowingly
          collect personal information from anyone under the age of 18.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          5. Your Rights
        </h2>
        <p>
          You may request access to or deletion of your account data at any time,
          subject to legal and operational requirements.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          6. Contact
        </h2>
        <p>
          If you have questions about this Privacy Policy, contact us at{" "}
          <strong>support@yourdomain.com</strong>.
        </p>
      </section>
    </main>
  );
}