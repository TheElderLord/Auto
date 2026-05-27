'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';

interface Props {
  stockItemId: string;
  qty?: number;
}

export function AddToCartButton({ stockItemId, qty = 1 }: Props) {
  const { addItem } = useCart();
  const [state, setState] = useState<'idle' | 'loading' | 'added' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleClick() {
    setState('loading');
    const { error } = await addItem(stockItemId, qty);
    if (error) {
      setErrorMsg(error);
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    } else {
      setState('added');
      setTimeout(() => setState('idle'), 2000);
    }
  }

  if (state === 'added') {
    return <span className="add-to-cart-btn added">Added ✓</span>;
  }
  if (state === 'error') {
    return <span className="add-to-cart-btn error" title={errorMsg}>No stock</span>;
  }

  return (
    <button
      className="add-to-cart-btn"
      onClick={handleClick}
      disabled={state === 'loading'}
    >
      {state === 'loading' ? '...' : 'Add to cart'}
    </button>
  );
}
