import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Journy - Wine Digital Product Passports',
  description: 'B2B platform for wine producers and importers to manage Digital Product Passports',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

