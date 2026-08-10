import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://escolabenonivio.vercel.app';
  const lastModified = new Date();

  const routes = [
    '',
    '/sobre',
    '/acervo',
    '/avisos',
    '/documentos',
    '/turmas',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: (route === '' || route === '/avisos' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
