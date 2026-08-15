export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexmedia.ai';
  
  return {
    title: resolvedParams.locale === 'ar' ? 'توليد فيديو بالذكاء الاصطناعي (Google Veo & Grok) | NexMedia' : 'AI Text to Video Generator (Veo & Grok) | NexMedia',
    description: resolvedParams.locale === 'ar' ? 'اصنع فيديوهات سينمائية من النصوص باستخدام أحدث نماذج الذكاء الاصطناعي العالمية مثل Google Veo 3.1 و xAI Grok حصرياً.' : 'Create cinematic videos from text using the world\'s most advanced AI models like Google Veo 3.1 and xAI Grok.',
    alternates: {
      languages: {
        en: `${baseUrl}/en/tools/text-to-video`,
        ar: `${baseUrl}/ar/tools/text-to-video`,
      },
    },
  };
}

export default async function TextToVideoLayout({
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
            {isRtl ? 'توليد الفيديو بالنصوص باستخدام Google Veo و Grok' : 'Text to Video Generation using Google Veo and Grok'}
          </h2>
          
          <div className="prose prose-invert prose-violet max-w-none text-white/70">
            <p className="leading-relaxed mb-6">
              {isRtl 
                ? 'مرحباً بك في أداة توليد الفيديو الأكثر تطوراً. نحن في NexMedia نفخر بتقديم الوصول الحصري والمباشر إلى أقوى نماذج الذكاء الاصطناعي في العالم لتوليد الفيديو، وعلى رأسها نماذج Google Veo 3.1 ونماذج xAI Grok.'
                : 'Welcome to the most advanced video generation tool. We at NexMedia are proud to provide exclusive direct access to the world\'s most powerful AI video generation models, including Google Veo 3.1 and xAI Grok.'}
            </p>
            
            <h3 className="text-xl font-bold text-fuchsia-400 mb-4">
              {isRtl ? 'النماذج المدعومة في المنصة' : 'Supported Models on the Platform'}
            </h3>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-violet-500 mt-1">✓</span>
                <div>
                  <strong className="text-white block mb-1">Google Veo 3.1 (Fast & Quality)</strong>
                  <span>{isRtl ? 'يعتبر نموذج جوجل Veo من أقوى النماذج في فهم الأوامر المعقدة وتوليد فيديوهات سينمائية بدقة 1080p وحركة كاميرا واقعية جداً. متوفر بنسختين للسرعة والجودة.' : 'Google Veo is one of the most powerful models for understanding complex prompts and generating cinematic 1080p videos with highly realistic camera movements.'}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-violet-500 mt-1">✓</span>
                <div>
                  <strong className="text-white block mb-1">xAI Grok Imagine</strong>
                  <span>{isRtl ? 'نموذج Grok المتطور من xAI يتميز بالسرعة الفائقة والقدرة على توليد فيديوهات طويلة تصل إلى 30 ثانية في اللقطة الواحدة مع مرونة عالية في التحكم بالوقت.' : 'The advanced Grok model by xAI features extreme speed and the ability to generate long videos up to 30 seconds per shot with high time-control flexibility.'}</span>
                </div>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-fuchsia-400 mb-4">
              {isRtl ? 'لماذا تستخدم هذه النماذج عبر NexMedia؟' : 'Why use these models via NexMedia?'}
            </h3>
            <p className="leading-relaxed mb-6">
              {isRtl
                ? 'بدلاً من دفع اشتراكات شهرية متعددة لكل شركة على حدة، توفر لك منصتنا واجهة واحدة متكاملة للوصول إلى Google Veo و Grok بأسعار تنافسية ونظام رصيد مرن، مع دعم كامل للأوامر (Prompts) باللغة العربية.'
                : 'Instead of paying multiple monthly subscriptions to each company, our platform provides a single integrated interface to access Google Veo and Grok at competitive prices with a flexible credit system and full support for prompts.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
