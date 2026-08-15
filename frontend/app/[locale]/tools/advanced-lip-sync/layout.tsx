export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexmedia.ai';
  
  return {
    title: resolvedParams.locale === 'ar' ? 'مزامنة الشفاه مع الصوت للفيديو | NexMedia' : 'AI Video Lip Sync | NexMedia',
    description: resolvedParams.locale === 'ar' ? 'قم بتركيب أي ملف صوتي على فيديو وتطابق حركة الشفاه بدقة متناهية.' : 'Sync any audio file to a video with highly accurate lip-sync AI technology.',
    alternates: {
      languages: {
        en: `${baseUrl}/en/tools/advanced-lip-sync`,
        ar: `${baseUrl}/ar/tools/advanced-lip-sync`,
      },
    },
  };
}

export default function LipSyncLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
