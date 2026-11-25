import { Bodoni_Moda, Cinzel, EB_Garamond, Figtree, Gloock, Italiana, Lora, Manrope } from 'next/font/google';
import './estilo.css';

const bodoni = Bodoni_Moda({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--sp-bodoni' });
const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--sp-figtree' });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--sp-cinzel' });
const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--sp-garamond' });
const italiana = Italiana({ subsets: ['latin'], weight: '400', variable: '--sp-italiana' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--sp-lora' });
const gloock = Gloock({ subsets: ['latin'], weight: '400', variable: '--sp-gloock' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--sp-manrope' });
const fonts = [bodoni, figtree, cinzel, garamond, italiana, lora, gloock, manrope].map((f) => f.variable).join(' ');

const OPCOES = [
  {
    id: 'atelie',
    nome: 'Ateliê',
    ideia: 'Revista de moda dos anos 1950. Contraste alto, muito respiro, rosa empoeirado e fio dourado.',
    fontes: 'Bodoni Moda + Figtree',
    cores: ['#F4EFE8', '#FBF8F3', '#1A1717', '#B9857E', '#B8A07A'],
  },
  {
    id: 'botica',
    nome: 'Botica',
    ideia: 'Rótulos de farmácia antiga e livros encadernados. Capitulares romanas, verde-oliva e bordô.',
    fontes: 'Cinzel + EB Garamond',
    cores: ['#ECE6D8', '#F6F2E8', '#2A2A22', '#5B6340', '#7B2D2D'],
  },
  {
    id: 'belle',
    nome: 'Belle Époque',
    ideia: 'Papelaria fina do começo do século XX. Letras finas e altas, ameixa, sálvia e champanhe.',
    fontes: 'Italiana + Lora',
    cores: ['#EDEEE8', '#F8F8F4', '#2B2A33', '#6B4A63', '#8A9A86'],
  },
  {
    id: 'clube',
    nome: 'Clube',
    ideia: 'Biblioteca com poltronas de couro. Serifa calorosa, bordô, tabaco e latão.',
    fontes: 'Gloock + Manrope',
    cores: ['#EFE7DA', '#F8F3EA', '#241C17', '#6E1F24', '#B08A4A'],
  },
];

function Amostra() {
  return (
    <div className="sp-ui">
      <div className="sp-head">
        <span className="sp-eyebrow">Quarta · 25 de novembro</span>
        <h2 className="sp-display">Bom dia, <em>três coisas</em> importam hoje.</h2>
      </div>
      <div className="sp-grid">
        <section className="sp-card">
          <h3 className="sp-title">Três prioridades</h3>
          <ul className="sp-list">
            <li className="done"><span className="sp-n">1</span><span className="sp-t">Treino funcional, 30 min<small>Saúde</small></span><i className="sp-check on" /></li>
            <li><span className="sp-n">2</span><span className="sp-t">Finalizar parecer — Cliente Almeida<small>Carreira · adiada 1×</small></span><i className="sp-check" /></li>
            <li><span className="sp-n">3</span><span className="sp-t">Fechar orçamento de dezembro<small>Finanças</small></span><i className="sp-check" /></li>
          </ul>
        </section>
        <section className="sp-card">
          <h3 className="sp-title">Metas do mês</h3>
          <div className="sp-goal"><div><b>Treinar 12 vezes</b><span>9 / 12</span></div><div className="sp-bar"><i style={{ width: '75%' }} /></div></div>
          <div className="sp-goal"><div><b>Reserva de emergência</b><span>R$ 1.200 / 2.000</span></div><div className="sp-bar"><i style={{ width: '60%' }} /></div></div>
          <p className="sp-body">Hoje há três compromissos e um intervalo livre às 14h. A consulta com a dermatologista já foi adiada três vezes.</p>
          <div className="sp-actions"><button className="sp-btn">Fechar o dia</button><button className="sp-btn ghost">Ver semana</button></div>
        </section>
      </div>
    </div>
  );
}

export default function Estilo() {
  return (
    <div className={`sp-page ${fonts}`}>
      <header className="sp-intro">
        <p>Etapa 1 · Identidade visual</p>
        <h1>Quatro propostas</h1>
        <span>Mesmo conteúdo, quatro tipografias e paletas. Escolha uma, ou combine partes.</span>
      </header>
      {OPCOES.map((o, i) => (
        <article key={o.id} id={o.id} className={`sp-opt sp-${o.id}`}>
          <div className="sp-label">
            <span className="sp-letter">{String.fromCharCode(65 + i)}</span>
            <div>
              <strong>{o.nome}</strong>
              <p>{o.ideia}</p>
            </div>
            <div className="sp-meta">
              <span>{o.fontes}</span>
              <span className="sp-sw">{o.cores.map((c) => <i key={c} style={{ background: c }} />)}</span>
            </div>
          </div>
          <Amostra />
        </article>
      ))}
    </div>
  );
}
