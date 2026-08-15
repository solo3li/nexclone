export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexmedia.ai';
  
  return {
    title: resolvedParams.locale === 'ar' ? 'نسخ الحركة بالذكاء الاصطناعي | NexMedia' : 'AI Motion Transfer | NexMedia',
    description: resolvedParams.locale === 'ar' ? 'انقل حركة شخص في فيديو إلى صورة ثابتة بدقة متناهية.' : 'Transfer motion from a video to a static image with high accuracy.',
    alternates: {
      languages: {
        en: `${baseUrl}/en/tools/motion-control`,
        ar: `${baseUrl}/ar/tools/motion-control`,
      },
    },
  };
}

export default function MotionControlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
