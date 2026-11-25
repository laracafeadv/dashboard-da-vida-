import { Figtree, Instrument_Serif, La_Belle_Aurore } from 'next/font/google';
import { Flourish, LaceOval, WaxSeal } from '@/components/ui/vintage';
import './estilo.css';

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--vt-serif' });
const sans = Figtree({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--vt-sans' });
const script = La_Belle_Aurore({ subsets: ['latin'], weight: '400', variable: '--vt-script' });

const VARIACOES = [
  { id: 'carta', nome: 'Carta', ideia: 'Tecido xadrez bordô ao fundo, papel creme, selo postal e lacre.' },
  { id: 'enxoval', nome: 'Enxoval', ideia: 'Listras de tecido em vinho e creme, tinta marrom-chocolate, renda e lacre.' },
];

function Quadro({ id }: { id: string }) {
  return (
    <div className="vt-board">
      <header className="vt-top">
        <LaceOval id={`${id}-oval`} className="vt-oval">
          <span className="vt-oval-wd">quarta-feira</span>
          <span className="vt-oval-day">25</span>
          <span className="vt-oval-month">de novembro</span>
        </LaceOval>
        <div className="vt-hello">
          <Flourish className="vt-flourish" />
          <h2>Bom dia. Hoje, <em>só três coisas precisam de você.</em></h2>
          <form className="vt-capture">
            <span>Anotar</span>
            <input readOnly value="" placeholder="pagar IPVA sexta 15h #finanças !" aria-label="Anotar" />
            <button type="button">Guardar</button>
          </form>
        </div>
      </header>

      <div className="vt-grid">
        <section className="vt-stamp">
          <div className="vt-stamp-in">
            <Flourish className="vt-flourish sm" />
            <h3>Três prioridades</h3>
            <ol className="vt-prio">
              <li className="done"><i className="vt-check on" /><span>Treino funcional, 30 min<small>Saúde</small></span></li>
              <li><i className="vt-check" /><span>Finalizar parecer — Cliente Almeida<small>Carreira · adiada 1×</small></span></li>
              <li><i className="vt-check" /><span>Fechar orçamento de dezembro<small>Finanças</small></span></li>
            </ol>
          </div>
        </section>

        <section className="vt-paper">
          <h3>Metas do mês</h3>
          <div className="vt-goal"><div><b>Treinar 12 vezes</b><span>9 de 12</span></div><div className="vt-bar"><i style={{ width: '75%' }} /></div></div>
          <div className="vt-goal"><div><b>Reserva de emergência</b><span>R$ 1.200 de 2.000</span></div><div className="vt-bar"><i style={{ width: '60%' }} /></div></div>
          <div className="vt-goal"><div><b>Ler 300 páginas</b><span>180 de 300</span></div><div className="vt-bar"><i style={{ width: '60%' }} /></div></div>
          <div className="vt-actions"><button className="vt-btn">Ver semana</button><button className="vt-btn ghost">Todas as metas</button></div>
        </section>

        <section className="vt-note">
          <WaxSeal id={`${id}-seal`} className="vt-seal" />
          <h3>Fechar o dia</h3>
          <p className="vt-hand">A audiência rendeu. Amanhã, uma pausa de verdade à tarde.</p>
          <p className="vt-small">2 tarefas seguem para amanhã · 4 itens concluídos</p>
          <button className="vt-btn">Fechar e lacrar</button>
        </section>
      </div>
    </div>
  );
}

export default function Estilo() {
  return (
    <div className={`vt-page ${serif.variable} ${sans.variable} ${script.variable}`}>
      <header className="vt-intro">
        <p>Etapa 1 · Identidade visual · a partir das suas referências</p>
        <h1>Correspondência romântica</h1>
        <span>Duas variações com os mesmos elementos: renda, selo postal, lacre, arabesco e letra manuscrita.</span>
      </header>
      {VARIACOES.map((v, i) => (
        <article key={v.id} id={v.id} className={`vt-opt vt-${v.id}`}>
          <div className="vt-label"><b>{String.fromCharCode(65 + i)} · {v.nome}</b><span>{v.ideia}</span></div>
          <Quadro id={v.id} />
        </article>
      ))}
    </div>
  );
}
