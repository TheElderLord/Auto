import { Suspense } from 'react';
import { SearchForm } from './components/SearchForm';

interface ProductSummary {
  id: string;
  article: string;
  name: string;
  brand: { id: string; name: string; slug: string };
  primaryImage: { url: string } | null;
}

interface SearchResults {
  query: string;
  total: number;
  results: ProductSummary[];
}

async function fetchResults(q: string): Promise<SearchResults> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
  const res = await fetch(`${apiUrl}/catalog/search?q=${encodeURIComponent(q)}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<SearchResults>;
}

export default async function StorefrontPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  let results: SearchResults | null = null;
  let error: string | null = null;

  if (q.trim().length >= 2) {
    try {
      results = await fetchResults(q.trim());
    } catch {
      error = 'Could not reach the API. Make sure the API server and database are running.';
    }
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <p className="eyebrow">Storefront</p>
        <h1>Find auto parts</h1>
      </div>

      <Suspense>
        <SearchForm />
      </Suspense>

      {error && <p className="search-error">{error}</p>}

      {results && results.total === 0 && (
        <p className="search-empty">No products found for &ldquo;{q}&rdquo;.</p>
      )}

      {results && results.total > 0 && (
        <>
          <p className="results-meta">
            {results.total} result{results.total !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
          </p>
          <table className="results-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Name</th>
                <th>Brand</th>
              </tr>
            </thead>
            <tbody>
              {results.results.map((p) => (
                <tr key={p.id}>
                  <td className="article-cell">
                    <code>{p.article}</code>
                  </td>
                  <td>{p.name}</td>
                  <td>{p.brand.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!q && (
        <div className="search-hint">
          <p>Try an article number to get started:</p>
          <div className="hint-chips">
            {['04465-33450', 'D1212', 'RLL10902', 'W712/83'].map((ex) => (
              <a key={ex} href={`/?q=${encodeURIComponent(ex)}`} className="hint-chip">
                {ex}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
