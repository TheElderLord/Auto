import type { Metadata } from 'next';
import Link from 'next/link';
import { Providers } from './providers';
import { CartIcon } from './components/CartIcon';
import './globals.css';

export const metadata: Metadata = {
  title: 'Auto Parts',
  description: 'Auto-parts ecommerce and admin platform rebuild'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="app-header">
            <Link className="brand" href="/">
              Auto Parts
            </Link>
            <nav className="nav">
              <Link href="/">Storefront</Link>
              <Link href="/admin">Admin</Link>
            </nav>
            <CartIcon />
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
