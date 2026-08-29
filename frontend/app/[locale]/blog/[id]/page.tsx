import Client from './Client';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string, locale: string }> }): Promise<Metadata> {
  const { id, locale } = await params;
  const isRtl = locale === 'ar';
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  let post = null;
  
  try {
    const res = await fetch(`${apiUrl}/api/Blog/${id}`);
    if (res.ok) {
      post = await res.json();
    }
  } catch(e) {}

  if (!post) {
    return { title: "Post Not Found" };
  }

  const title = isRtl ? post.titleAr : post.titleEn;
  // Extract a brief description from the HTML content
  const content = isRtl ? post.contentAr : post.contentEn;
  const description = content ? content.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' : '';

  return {
    title: `${title} | NexMedia Blog`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.createdAt,
      authors: ['NexMedia AI'],
    },
    alternates: {
      canonical: `https://nexmedia.ai/${locale}/blog/${id}`,
      languages: {
        'en': `https://nexmedia.ai/en/blog/${id}`,
        'ar': `https://nexmedia.ai/ar/blog/${id}`,
      }
    }
  };
}

// Generate static params for SSG
// export async function generateStaticParams() {
//   return blogArticles.flatMap(post => [
//     { locale: 'en', id: post.slug },
//     { locale: 'ar', id: post.slug }
//   ]);
// }

export default async function Page({ params, searchParams }: { params: Promise<any>, searchParams?: Promise<any> }) {
  return <Client params={params} />;
}
