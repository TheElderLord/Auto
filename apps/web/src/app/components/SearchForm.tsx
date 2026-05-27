'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const current = searchParams.get('q') ?? '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? '';
    if (!q) return;
    router.push(`/?q=${encodeURIComponent(q)}`);
  }

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <label htmlFor="article">Article or part number</label>
      <div className="search-row">
        <input
          ref={inputRef}
          id="article"
          name="article"
          defaultValue={current}
          placeholder="e.g. 04465-33450"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </div>
    </form>
  );
}
