import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="container-app py-32 text-center">
      <h1 className="font-display text-5xl font-semibold mb-4">404</h1>
      <p className="text-neutral-600 mb-8">Page not found.</p>
      <Link to="/" className="text-primary-600 font-medium hover:underline">Back to home</Link>
    </section>
  );
}