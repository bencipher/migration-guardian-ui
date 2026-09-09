export default function TermsPage() {
  return (
    <div className="container-public py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-ink-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-ink-400">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 text-sm text-ink-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Overview</h2>
            <p>These terms govern your use of Migration Guardian. Full legal terms will be provided with the production release.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Acceptable use</h2>
            <p>You agree to use Migration Guardian for evaluating database migrations against databases you are authorized to access. You are responsible for the accuracy of connection credentials and the appropriateness of migrations you submit for analysis.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Service availability</h2>
            <p>Migration Guardian is provided on an as-available basis. We do not guarantee uninterrupted service and may modify or discontinue features as the product evolves.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Security boundaries</h2>
            <p>Migration Guardian operates within defined security boundaries: read-only source access, isolated sandbox execution, and static analysis of uploaded Python artifacts. These boundaries are documented in the Security Model section of the product documentation.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink-900 mb-2">Contact</h2>
            <p>Questions about these terms? Contact us at <a href="mailto:hello@migrationguardian.io" className="text-brand-600 hover:text-brand-700">hello@migrationguardian.io</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
