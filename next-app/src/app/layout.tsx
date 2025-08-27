import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'D2C Sync - Modern App',
    template: '%s | D2C Sync',
  },
  description: 'Production-ready app scaffold with Next.js, Prisma, and NextAuth.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'D2C Sync',
    description: 'Modern full-stack app',
    url: 'https://example.com',
    siteName: 'D2C Sync',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

