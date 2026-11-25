type Variant = 'paper' | 'stamp' | 'note';

interface Props {
  title: string;
  meta?: React.ReactNode;
  variant?: Variant;
  flourish?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Cartão do caderno. `paper` para o dia a dia, `stamp` e `note` (moldura dourada) para os destaques. */
export function Card({ title, meta, variant = 'paper', flourish, className, children }: Props) {
  const head = (
    <div className="card-head">
      {flourish && <span className="rule" aria-hidden="true" />}
      <h2 className="card-title">{title}</h2>
      {meta && <span className="card-meta">{meta}</span>}
    </div>
  );

  return (
    <section className={`${variant === 'paper' ? 'paper' : 'feature'} ${className ?? ''}`}>
      {head}
      {children}
    </section>
  );
}
