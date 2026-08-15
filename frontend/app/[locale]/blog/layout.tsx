import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'ar';

  const title = isRtl 
    ? "مدونة NexMedia للذكاء الاصطناعي - أدوات، شروحات وأخبار" 
    : "NexMedia AI Blog - Tools, Tutorials & News";
    
  const description = isRtl 
    ? "اكتشف أحدث أخبار الذكاء الاصطناعي، شروحات استخدام Google Veo و xAI Grok، ونصائح لإنشاء محتوى فيديو وصوت احترافي." 
    : "Discover the latest AI news, tutorials on Google Veo and xAI Grok, and tips for creating professional video and audio content.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://nexmedia.ai/${locale}/blog`,
    },
    alternates: {
      canonical: `https://nexmedia.ai/${locale}/blog`,
      languages: {
        'en': 'https://nexmedia.ai/en/blog',
        'ar': 'https://nexmedia.ai/ar/blog',
      }
    }
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
