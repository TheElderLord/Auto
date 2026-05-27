'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

interface CartItem {
  id: string;
  article: string;
  name: string;
  brand: string;
  storageName: string;
  officeName: string;
  qty: number;
  unitPrice: number;
  currency: string;
  lineTotal: number;
}

interface Cart {
  id: string;
  status: string;
  items: CartItem[];
  total: number;
  currency: string;
}

function fmt(price: number, currency: string) {
  return new Intl.NumberFormat('ru-KZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

export default function CartPage() {
  const router = useRouter();
  const { cartId, itemCountChanged } = useCart();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!cartId) {
      setLoading(false);
      return;
    }
    fetch(`${API}/cart/${cartId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Cart | null) => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [cartId]);

  async function removeItem(itemId: string) {
    if (!cartId || !cart) return;
    setRemoving(itemId);
    const res = await fetch(`${API}/cart/${cartId}/items/${itemId}`, { method: 'DELETE' });
    if (res.ok) {
      const updated: Cart = await res.json();
      setCart(updated);
      itemCountChanged();
    }
    setRemoving(null);
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!cartId) return;
    setCheckoutError('');
    setCheckoutLoading(true);

    const res = await fetch(`${API}/cart/${cartId}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: name, customerPhone: phone, customerEmail: email || undefined }),
    });

    if (res.ok) {
      const result = await res.json();
      localStorage.removeItem('cartId');
      router.push(`/orders/${result.orderId as string}`);
    } else {
      const body = await res.json().catch(() => ({}));
      setCheckoutError((body as { message?: string }).message ?? 'Checkout failed');
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="page-shell">
        <p className="search-empty">Loading cart…</p>
      </section>
    );
  }

  if (!cartId || !cart || cart.items.length === 0) {
    return (
      <section className="page-shell">
        <div className="section-heading">
          <p className="eyebrow">Cart</p>
          <h1>Your cart is empty</h1>
        </div>
        <Link href="/" className="btn-primary">Search for parts</Link>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <p className="eyebrow">Cart</p>
        <h1>Your cart</h1>
      </div>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <p className="cart-item-name">
                <strong>{item.name}</strong>
                <span className="muted"> — {item.brand}</span>
              </p>
              <p className="cart-item-meta">
                <code>{item.article}</code>
                {' · '}{item.storageName}{' · '}{item.officeName}
              </p>
              <p className="cart-item-price">
                {item.qty} × {fmt(item.unitPrice, item.currency)}
                {' = '}
                <strong>{fmt(item.lineTotal, item.currency)}</strong>
              </p>
            </div>
            <button
              className="cart-item-remove"
              onClick={() => removeItem(item.id)}
              disabled={removing === item.id}
            >
              {removing === item.id ? '…' : 'Remove'}
            </button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        Total: <strong>{fmt(cart.total, cart.currency)}</strong>
      </div>

      <div className="checkout-panel">
        <h2 className="checkout-heading">Checkout</h2>
        <form className="checkout-form" onSubmit={handleCheckout}>
          <label>
            Full name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
            />
          </label>
          <label>
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+7 700 123 4567"
            />
          </label>
          <label>
            Email <span className="muted">(optional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          {checkoutError && <p className="search-error">{checkoutError}</p>}
          <button type="submit" className="btn-checkout" disabled={checkoutLoading}>
            {checkoutLoading ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </div>
    </section>
  );
}
