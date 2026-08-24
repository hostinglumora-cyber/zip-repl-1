export default function UserNotRegisteredError() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Account unavailable</h1>
        <p className="mt-3 text-slate-600">
          This account is not registered for the marketplace yet.
        </p>
        <a
          href="/register"
          className="mt-6 inline-flex rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
        >
          Create an account
        </a>
      </section>
    </main>
  );
}