import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://example.com';
  return [
    { url: `${base}/`, priority: 1, changeFrequency: 'weekly' },
    { url: `${base}/dashboard`, priority: 0.8, changeFrequency: 'monthly' },
  ];
}

