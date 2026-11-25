import type { Metadata, Viewport } from 'next';
import {
  Abril_Fatface, Cormorant_Garamond, Cormorant_SC, Courier_Prime, Jost, Libre_Baskerville, Libre_Franklin, Limelight,
} from 'next/font/google';
import { Shell } from '@/components/shell/Shell';
import './globals.css';
import './hoje.css';

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-cormorant' });
const cormorantSC = Cormorant_SC({ subsets: ['latin'], weight: ['500', '600'], variable: '--font-cormorant-sc' });
const franklin = Libre_Franklin({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-franklin' });
const abril = Abril_Fatface({ subsets: ['latin'], weight: '400', variable: '--font-abril' });
const baskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'], variable: '--font-baskerville' });
const courier = Courier_Prime({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-courier' });
const limelight = Limelight({ subsets: ['latin'], weight: '400', variable: '--font-limelight' });
const jost = Jost({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-jost' });

const fonts = [cormorant, cormorantSC, franklin, abril, baskerville, courier, limelight, jost].map((f) => f.variable).join(' ');

export const metadata: Metadata = {
  title: 'Diário da Vida',
  description: 'Rotina, metas e pensamentos em um só caderno.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

// Aplica a direção visual salva antes da primeira pintura, para não piscar.
const themeScript = `try{var s=JSON.parse(localStorage.getItem('diario-da-vida'));if(s&&s.state&&s.state.direction)document.documentElement.dataset.dir=s.state.direction}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-dir="gabinete" className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
