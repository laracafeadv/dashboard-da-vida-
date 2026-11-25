import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Instrument_Serif, Ms_Madi } from 'next/font/google';
import { Shell } from '@/components/shell/Shell';
import './globals.css';
import './hoje.css';

// Fontes da referência: versais finas (Cormorant Garamond) + itálico condensado (Instrument Serif).
const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-serif' });
const accent = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-accent' });
const hand = Ms_Madi({ subsets: ['latin'], weight: '400', variable: '--font-hand' });

export const metadata: Metadata = {
  title: 'Diário da Vida',
  description: 'Rotina, metas e pensamentos em um só caderno.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#2c1713' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${accent.variable} ${hand.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
