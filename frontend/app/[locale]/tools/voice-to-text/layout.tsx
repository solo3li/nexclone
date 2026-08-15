export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexmedia.ai';
  
  return {
    title: resolvedParams.locale === 'ar' ? 'تحويل الصوت إلى نص بالذكاء الاصطناعي | NexMedia' : 'AI Voice to Text Converter | NexMedia',
    description: resolvedParams.locale === 'ar' ? 'حول ملفاتك الصوتية ومقاطع الفيديو إلى نصوص دقيقة في ثوانٍ. تفريغ صوتي احترافي يدعم اللغة العربية.' : 'Transcribe your audio and video files into accurate text in seconds. Professional AI transcription.',
    alternates: {
      languages: {
        en: `${baseUrl}/en/tools/voice-to-text`,
        ar: `${baseUrl}/ar/tools/voice-to-text`,
      },
    },
  };
}

export default function VoiceToTextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
