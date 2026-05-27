import Link from 'next/link';
import type { Route } from 'next';

const adminAreas = [
  { label: 'Products', href: '/admin/products', ready: true },
  { label: 'Orders', href: '/admin/orders', ready: false },
  { label: 'Storages', href: '/admin/storages', ready: false },
  { label: 'Price imports', href: '/admin/imports', ready: false },
  { label: 'Suppliers', href: '/admin/suppliers', ready: false },
  { label: 'Users', href: '/admin/users', ready: false },
];

export default function AdminPage() {
  return (
    <section className="page-shell">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h1>Operations dashboard</h1>
        <p>
          Manager workflows: catalog, orders, inventory, imports, and users.
        </p>
      </div>

      <div className="content-grid">
        {adminAreas.map((area) => (
          <article className="summary-card" key={area.label}>
            <span>{area.ready ? 'Ready' : 'Planned'}</span>
            {area.ready ? (
              <Link href={area.href as Route}>
                <strong>{area.label}</strong>
              </Link>
            ) : (
              <strong>{area.label}</strong>
            )}
            <p>
              {area.ready
                ? `View and manage ${area.label.toLowerCase()}.`
                : 'Coming in a future phase.'}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

