interface ProductSummary {
  id: string;
  article: string;
  name: string;
  brand: { name: string };
  primaryImage: { url: string } | null;
}

interface ProductList {
  total: number;
  items: ProductSummary[];
}

async function fetchProducts(): Promise<ProductList> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
  const res = await fetch(`${apiUrl}/catalog/products?take=200`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<ProductList>;
}

export default async function AdminProductsPage() {
  let data: ProductList | null = null;
  let error: string | null = null;

  try {
    data = await fetchProducts();
  } catch {
    error = 'Could not reach the API. Make sure the API server and database are running.';
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <p className="eyebrow">Admin — Catalog</p>
        <h1>Products</h1>
        {data && (
          <p>{data.total} product{data.total !== 1 ? 's' : ''} in the catalog</p>
        )}
      </div>

      {error && <p className="search-error">{error}</p>}

      {data && data.items.length === 0 && (
        <p className="search-empty">
          No products yet. Run <code>npm run seed -w @kazparts/db</code> to add sample data.
        </p>
      )}

      {data && data.items.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Name</th>
              <th>Brand</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((p) => (
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
      )}
    </section>
  );
}
