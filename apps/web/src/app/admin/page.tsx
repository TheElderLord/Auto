const adminAreas = [
  'Orders',
  'Products',
  'Storages',
  'Price imports',
  'Suppliers',
  'Users'
];

export default function AdminPage() {
  return (
    <section className="page-shell">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h1>Operations dashboard</h1>
        <p>
          Starting point for manager workflows: orders, inventory, imports,
          supplier integrations, and user management.
        </p>
      </div>

      <div className="content-grid">
        {adminAreas.map((area) => (
          <article className="summary-card" key={area}>
            <span>Module</span>
            <strong>{area}</strong>
            <p>Module placeholder for the rebuild roadmap.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

