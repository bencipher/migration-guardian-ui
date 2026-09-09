export default function PrivacyPage() {
  return (
    <div className="container-public py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-ink-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-400">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 text-sm text-ink-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Overview</h2>
            <p>Migration Guardian is a PostgreSQL migration safety platform. This page summarizes how we handle data. Full legal terms will be provided with the production release.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Database credentials</h2>
            <p>Database connection credentials provided to Migration Guardian are ephemeral in the current web workflow. They are used to establish a read-only connection for source inspection and are not persisted beyond the active session.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Migration artifacts</h2>
            <p>Uploaded migration files are analyzed for the purpose of producing a migration assessment. They are associated with your account and review history.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Read-only access</h2>
            <p>Migration Guardian connects to source databases using read-only credentials only. No write operations are performed against source databases at any time.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Contact</h2>
            <p>Questions about privacy? Contact us at <a href="mailto:hello@migrationguardian.io" className="text-brand-600 hover:text-brand-700">hello@migrationguardian.io</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
