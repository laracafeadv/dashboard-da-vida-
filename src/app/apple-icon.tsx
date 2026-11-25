import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Ícone do site: monograma "D" em itálico sobre papel. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e3dc', color: '#1e1a17', fontSize: 120, fontStyle: 'italic', fontFamily: 'serif' }}>
        D
      </div>
    ),
    size,
  );
}
