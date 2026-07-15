import type { Metadata } from 'next';
import '../../../packages/ui/src/styles/theme.css';
import './global.css';

export const metadata: Metadata = {
  title: 'Kingdom Leaders 2026 - Equipping Leaders. Empowering Churches. Expanding God\'s Kingdom.',
  description: 'Kingdom Leaders 2026 is a one-day leadership conference dedicated to inspiring, equipping, and connecting Christian leaders for faithful and impactful ministry.',
  keywords: ['Kingdom Leaders 2026', 'Palpanabanouthoor C.S.I. Church', 'Christian Endeavour', 'Christian Leadership Conference', 'Pastors', 'Church Leaders'],
  authors: [{ name: 'Christian Endeavour Social Concern Team' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
