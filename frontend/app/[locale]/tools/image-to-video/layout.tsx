export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexmedia.ai';
  
  return {
    title: resolvedParams.locale === 'ar' ? 'تحريك الصور وتوليد أفاتار يتحدث | NexMedia' : 'AI Image to Video & Talking Avatar | NexMedia',
    description: resolvedParams.locale === 'ar' ? 'اصنع فيديوهات احترافية من الصور الثابتة. حول أي صورة إلى أفاتار يتحدث بالذكاء الاصطناعي.' : 'Create professional videos from static images. Turn any image into a talking AI avatar.',
    alternates: {
      languages: {
        en: `${baseUrl}/en/tools/image-to-video`,
        ar: `${baseUrl}/ar/tools/image-to-video`,
      },
    },
  };
}

export default function ImageToVideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
