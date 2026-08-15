import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexmedia.ai';
  
  return {
    title: resolvedParams.locale === 'ar' ? 'تحويل النص إلى صوت بالذكاء الاصطناعي | NexMedia' : 'AI Text to Voice Generator | NexMedia',
    description: resolvedParams.locale === 'ar' ? 'قم بتحويل نصوصك إلى تعليق صوتي بشري احترافي باستخدام أفضل تقنيات الذكاء الاصطناعي. يدعم اللغة العربية والعديد من اللغات.' : 'Convert your text into professional human-like voiceovers using advanced AI. Supports multiple languages and accents.',
    alternates: {
      languages: {
        en: `${baseUrl}/en/tools/text-to-voice`,
        ar: `${baseUrl}/ar/tools/text-to-voice`,
      },
    },
  };
}

export default async function TextToVoiceLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const resolvedParams = await params;
  const isRtl = resolvedParams.locale === 'ar';
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {children}
      </div>
      
      {/* SEO Optimized Article Section */}
      <section className="bg-[#05000a] border-t border-white/5 py-16 mt-12" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-6">
            {isRtl ? 'أفضل أداة لتحويل النص إلى صوت بالذكاء الاصطناعي' : 'The Best AI Text to Voice Generator'}
          </h2>
          
          <div className="prose prose-invert prose-violet max-w-none text-white/70">
            <p className="leading-relaxed mb-6">
              {isRtl 
                ? 'في عالم صناعة المحتوى اليوم، أصبح التعليق الصوتي الاحترافي ضرورة لا غنى عنها. باستخدام أداة NexMedia لتحويل النص إلى صوت، يمكنك الآن إنتاج ملفات صوتية عالية الجودة بنقرة زر واحدة دون الحاجة إلى توظيف معلقين صوتيين مكلفين أو شراء معدات تسجيل احترافية. تقنياتنا تعتمد على أحدث نماذج الذكاء الاصطناعي لتوليد أصوات بشرية طبيعية بنسبة 100%.'
                : 'In today\'s content creation world, professional voiceovers are essential. With NexMedia\'s Text to Speech tool, you can now produce high-quality audio files with a single click without the need to hire expensive voice actors or buy professional recording equipment. Our technology relies on the latest AI models to generate 100% natural human voices.'}
            </p>
            
            <h3 className="text-xl font-bold text-fuchsia-400 mb-4">
              {isRtl ? 'لماذا تختار منصتنا؟' : 'Why Choose Our Platform?'}
            </h3>
            
            <ul className="space-y-3 mb-8">
              {[
                isRtl ? 'دعم كامل للغة العربية بلهجات متعددة (خليجي، مصري، شامي).' : 'Full support for multiple languages and authentic local accents.',
                isRtl ? 'توفير آلاف الدولارات التي تدفع لمعلقين صوتيين.' : 'Save thousands of dollars spent on professional voice actors.',
                isRtl ? 'تحكم كامل في المشاعر ونبرة الصوت.' : 'Complete control over emotions and voice tone.',
                isRtl ? 'سرعة فائقة: حول مقال كامل إلى ملف صوتي جاهز للتحميل في ثوانٍ.' : 'Lightning fast: Convert a full article into a downloadable audio file in seconds.'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-bold text-fuchsia-400 mb-4">
              {isRtl ? 'كيفية تحويل النص إلى صوت' : 'How to Convert Text to Speech'}
            </h3>
            <p className="leading-relaxed mb-6">
              {isRtl
                ? 'العملية بسيطة للغاية: قم بنسخ النص الخاص بك ولصقه في المربع أعلاه. اختر لغة النص، ثم اختر المعلق الصوتي المناسب (رجل أو امرأة). يمكنك أيضاً تحديد سرعة القراءة والمشاعر إذا كنت تستخدم الباقة الاحترافية. أخيراً، اضغط على زر توليد وسيكون الملف الصوتي جاهزاً للتحميل.'
                : 'The process is incredibly simple: copy and paste your text into the box above. Choose the language, then select the appropriate voice actor (male or female). You can also set the reading speed and emotions if you use the premium plan. Finally, click generate and your audio file (MP3) will be ready to download.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
