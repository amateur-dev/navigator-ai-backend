import type { MetadataRoute } from 'next'
import { fetchBlogArticles } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://navigator-ai-app.vercel.app'

  // Fetch blog articles dynamically
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    const articles = await fetchBlogArticles()
    blogPosts = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7
    }))
  } catch {
    // Error fetching blog articles
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    ...blogPosts
  ]
}
