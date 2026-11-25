'use client';
import { useImageUrl } from '@/lib/images';
import type { NoteImage } from '@/lib/types';

export function Img({ img, className, alt = '' }: { img: NoteImage; className?: string; alt?: string }) {
  const url = useImageUrl(img);
  return (
    <span className={`img ${className ?? ''}`} style={{ aspectRatio: `${img.w} / ${img.h}` }}>
      {url ? <img src={url} alt={alt} loading="lazy" /> : null}
    </span>
  );
}
