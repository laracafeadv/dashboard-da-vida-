import type { Metadata, Viewport } from 'next';
import { EB_Garamond, Libre_Caslon_Display, Ms_Madi } from 'next/font/google';
import { Shell } from '@/components/shell/Shell';
import './globals.css';
import './hoje.css';

const display = Libre_Caslon_Display({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const serif = EB_Garamond({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-serif' });
const hand = Ms_Madi({ subsets: ['latin'], weight: '400', variable: '--font-hand' });

export const metadata: Metadata = {
  title: 'Diário da Vida',
  description: 'Rotina, metas e pensamentos em um só caderno.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#2c1713' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${serif.variable} ${hand.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
