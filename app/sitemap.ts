import type { MetadataRoute } from 'next';
import { products, policies } from '@/lib/content';

const BASE_URL = 'https://peptiq.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/shop`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/track-order`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.items.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const policyRoutes: MetadataRoute.Sitemap = policies.items.map((p) => ({
    url: `${BASE_URL}/policies/${p.slug}`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [...staticRoutes, ...productRoutes, ...policyRoutes];
}
