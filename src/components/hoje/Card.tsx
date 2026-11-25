import { Sprig } from '@/components/ui/vintage';

type Variant = 'paper' | 'stamp' | 'note';

interface Props {
  title: string;
  meta?: React.ReactNode;
  variant?: Variant;
  flourish?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Cartão do caderno. `paper` para o dia a dia, `stamp` e `note` para momentos especiais. */
export function Card({ title, meta, variant = 'paper', flourish, className, children }: Props) {
  const head = (
    <div className="card-head">
      {flourish && <Sprig />}
      <h2 className="card-title">{title}</h2>
      {meta && <span className="card-meta">{meta}</span>}
    </div>
  );

  if (variant === 'stamp')
    return (
      <section className={`stamp ${className ?? ''}`}>
        <div className="stamp-in">{head}{children}</div>
      </section>
    );

  return (
    <section className={`${variant} ${className ?? ''}`}>
      {head}
      {children}
    </section>
  );
}
