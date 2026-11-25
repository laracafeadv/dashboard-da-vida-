import Link from 'next/link';
import { notFound } from 'next/navigation';

const SECOES: Record<string, { titulo: string; fase: string; itens: string[] }> = {
  planejar: {
    titulo: 'Planejar',
    fase: 'Próxima etapa',
    itens: [
      'Semana: despejar tudo e a IA propõe a distribuição nos dias, considerando agenda e espaço livre.',
      'Metas: do resultado desejado até a ação da semana (engenharia reversa).',
      'Rotina: recorrências que geram tarefas sozinhas e versão mínima para dias difíceis.',
    ],
  },
  areas: {
    titulo: 'Áreas da vida',
    fase: 'Fase 4',
    itens: ['Raio-X mensal: importância × atenção real.', 'Páginas de Saúde e sono, Estudos, Finanças, Carreira e Relações.'],
  },
  caderno: {
    titulo: 'Caderno',
    fase: 'Fase 2',
    itens: ['Brain Dump com instrução para o Claude e histórico de versões.', 'Biblioteca de prints, referências e aprendizados, com análise por IA.'],
  },
  revisoes: {
    titulo: 'Revisões',
    fase: 'Fase 3',
    itens: ['Revisão semanal pré-preenchida com o que você fez, adiou e soltou.', 'Mensal, semestral e retrospectiva anual.'],
  },
};

export function generateStaticParams() {
  return Object.keys(SECOES).map((secao) => ({ secao }));
}

export default async function Secao({ params }: { params: Promise<{ secao: string }> }) {
  const { secao } = await params;
  const s = SECOES[secao];
  if (!s) notFound();
  return (
    <div className="soon-page">
      <p className="eyebrow">{s.fase} · em construção</p>
      <h1>{s.titulo}</h1>
      <section className="paper">
        <ul className="list">
          {s.itens.map((i) => <li key={i} className="soon-item">{i}</li>)}
        </ul>
        <p style={{ marginTop: 20, textAlign: 'center' }}><Link className="btn-ghost" href="/">Voltar para Hoje</Link></p>
      </section>
    </div>
  );
}
