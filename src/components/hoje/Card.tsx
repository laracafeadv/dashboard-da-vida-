'use client';
import { useStore } from '@/lib/store';
import { Ornament } from '@/components/ui/ornaments';

interface Props { title: string; meta?: React.ReactNode; className?: string; children: React.ReactNode }

export function Card({ title, meta, className, children }: Props) {
  const dir = useStore((s) => s.direction);
  return (
    <section className={`card ${className ?? ''}`}>
      <div className="card-head">
        <h2 className="card-title"><Ornament dir={dir} className="orn" />{title}</h2>
        {meta && <span className="card-meta">{meta}</span>}
      </div>
      {children}
    </section>
  );
}
