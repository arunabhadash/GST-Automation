import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'http://localhost:3000/', priority: 1 },
    { url: 'http://localhost:3000/login', priority: 0.7 },
    { url: 'http://localhost:3000/dashboard', priority: 0.8 },
  ]
}

