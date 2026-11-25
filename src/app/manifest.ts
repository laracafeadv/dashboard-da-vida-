import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Diário da Vida',
    short_name: 'Diário',
    description: 'Rotina, metas e pensamentos em um só caderno.',
    start_url: '/',
    display: 'standalone',
    background_color: '#e8e3dc',
    theme_color: '#e8e3dc',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
