import type { Metadata, Viewport } from 'next';
import { Figtree, Instrument_Serif, La_Belle_Aurore } from 'next/font/google';
import { Shell } from '@/components/shell/Shell';
import './globals.css';
import './hoje.css';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif' });
const sans = Figtree({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans' });
const script = La_Belle_Aurore({ subsets: ['latin'], weight: '400', variable: '--font-script' });

export const metadata: Metadata = {
  title: 'Diário da Vida',
  description: 'Rotina, metas e pensamentos em um só caderno.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#4f0c11' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
