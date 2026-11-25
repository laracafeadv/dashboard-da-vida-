import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/** Ícone do site: monograma "D" em itálico sobre papel. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e3dc', color: '#1e1a17', fontSize: 340, fontStyle: 'italic', fontFamily: 'serif' }}>
        D
      </div>
    ),
    size,
  );
}
