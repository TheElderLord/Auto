import Link from 'next/link';

interface OrderItem {
  id: string;
  article: string;
  name: string;
  brand: string;
  storageName: string;
  qty: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
  status: string;
}

interface Order {
  id: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: OrderItem[];
  total: number;
  currency: string;
  createdAt: string;
}

async function fetchOrder(id: string): Promise<Order | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
  const res = await fetch(`${apiUrl}/orders/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json() as Promise<Order>;
}

function fmt(price: number, currency: string) {
  return new Intl.NumberFormat('ru-KZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await fetchOrder(id);

  if (!order) {
    return (
      <section className="page-shell">
        <p className="search-error">Order not found.</p>
        <Link href="/">Back to search</Link>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <p className="eyebrow">Order confirmed</p>
        <h1>Thank you, {order.customerName}!</h1>
        <p>Order <code>{order.id}</code> · {new Date(order.createdAt).toLocaleDateString('ru-KZ')}</p>
      </div>

      <div className="cart-items">
        {order.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <p className="cart-item-name">
                <strong>{item.name}</strong>
                <span className="muted"> — {item.brand}</span>
              </p>
              <p className="cart-item-meta">
                <code>{item.article}</code> · {item.storageName}
              </p>
              <p className="cart-item-price">
                {item.qty} × {fmt(item.unitPrice, item.currency)}
                {' = '}
                <strong>{fmt(item.lineTotal, item.currency)}</strong>
              </p>
            </div>
            <span className={`stock-badge ${item.status === 'PENDING' ? 'out-of-stock' : 'in-stock'}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <div className="cart-total">
        Total: <strong>{fmt(order.total, order.currency)}</strong>
      </div>

      <div style={{ marginTop: '24px' }}>
        <Link href="/" className="btn-primary">Continue shopping</Link>
      </div>
    </section>
  );
}
