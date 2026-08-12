export default function StubPage({ title, description }) {
  return (
    <section className="container-app py-20">
      <p className="text-xs uppercase tracking-widest text-primary-600 font-medium mb-2">Architecture layer</p>
      <h1 className="font-display text-4xl font-semibold text-neutral-900 mb-4">{title}</h1>
      <p className="text-neutral-600 max-w-2xl">{description}</p>
      <div className="mt-8 p-6 rounded-2xl bg-white border border-neutral-200 text-sm text-neutral-500">
        Page route is wired. UI components and API integration will be implemented in the next phase.
      </div>
    </section>
  );
}