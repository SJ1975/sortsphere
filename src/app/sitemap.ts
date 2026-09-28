import { MetadataRoute } from 'next';
import { ALGORITHM_KEYS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sortsphere-xi.vercel.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  // Algorithm pages (these are protected but still indexable as landing targets)
  const algorithmPages: MetadataRoute.Sitemap = ALGORITHM_KEYS.map((key) => ({
    url: `${baseUrl}/visualize/${key}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...algorithmPages];
}