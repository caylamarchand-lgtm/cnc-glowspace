export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-slate-200">
      <h1 className="text-3xl font-extrabold text-pink-300">
        Terms of Service
      </h1>

      <p className="mt-2 text-sm text-slate-400">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="mt-8 space-y-4">
        <p>
          Welcome to GlowSpace. By accessing or using GlowSpace, you agree to these
          Terms of Service. If you do not agree, do not use the platform.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          1. Eligibility (18+ Only)
        </h2>
        <p>
          GlowSpace is an <strong>18+ only platform</strong>. You must be at least
          18 years old to create an account or use GlowSpace. By using GlowSpace,
          you represent and warrant that you are 18 or older.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          2. Your Account
        </h2>
        <p>
          You are responsible for maintaining the security of your account and for
          all activity that occurs under your account. Do not share your password
          with others.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          3. User Content
        </h2>
        <p>
          GlowSpace allows users to post content. You retain ownership of content
          you create, but you are solely responsible for what you post and any
          consequences resulting from your content.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          4. Prohibited Content & Behavior
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-slate-300">
          <li>Illegal content or promotion of illegal activity</li>
          <li>Harassment, hate speech, or abusive behavior</li>
          <li>Impersonation or misleading identity</li>
          <li>Posting content you do not have rights to</li>
          <li>Spam, scams, or malicious links</li>
        </ul>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          5. Moderation & Enforcement
        </h2>
        <p>
          GlowSpace reserves the right to remove content or suspend or terminate
          accounts at any time if we believe behavior violates these Terms or puts
          the community at risk.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          6. Disclaimers
        </h2>
        <p>
          GlowSpace is provided “as is” without warranties of any kind. We do not
          guarantee uninterrupted service and are not responsible for user-generated
          content.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          7. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, GlowSpace shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages.
        </p>

        <h2 className="mt-6 text-xl font-bold text-pink-200">
          8. Contact
        </h2>
        <p>
          If you have questions about these Terms, contact us at{" "}
          <strong>support@yourdomain.com</strong>.
        </p>
      </section>
    </main>
  );
}