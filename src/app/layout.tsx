import type { Metadata, Viewport } from 'next';
import { Cormorant_SC, Courier_Prime, EB_Garamond, Pinyon_Script } from 'next/font/google';
import { Shell } from '@/components/shell/Shell';
import './globals.css';
import './hoje.css';

const script = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-script' });
const caps = Cormorant_SC({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-caps' });
const serif = EB_Garamond({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-serif' });
const mono = Courier_Prime({ subsets: ['latin'], weight: '400', variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Diário da Vida',
  description: 'Rotina, metas e pensamentos em um só caderno.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#1f0e0c' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${script.variable} ${caps.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
