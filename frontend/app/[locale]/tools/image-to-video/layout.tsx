export async function generateMetadata({ params }: { params: Promise<{locale: string}> }) {
  const resolvedParams = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexmedia.ai';
  
  return {
    title: resolvedParams.locale === 'ar' ? 'تحويل الصور إلى فيديو بالذكاء الاصطناعي (Veo & Grok) | NexMedia' : 'AI Image to Video Generator (Veo & Grok) | NexMedia',
    description: resolvedParams.locale === 'ar' ? 'اصنع فيديوهات احترافية وحرك الصور الثابتة باستخدام أقوى نماذج الذكاء الاصطناعي مثل Google Veo 3.1 و xAI Grok.' : 'Create professional videos and animate static images using the most powerful AI models like Google Veo 3.1 and xAI Grok.',
    alternates: {
      languages: {
        en: `${baseUrl}/en/tools/image-to-video`,
        ar: `${baseUrl}/ar/tools/image-to-video`,
      },
    },
  };
}

export default async function ImageToVideoLayout({
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
            {isRtl ? 'تحويل الصور إلى فيديو باستخدام Google Veo و Grok' : 'Image to Video Generation using Google Veo and Grok'}
          </h2>
          
          <div className="prose prose-invert prose-violet max-w-none text-white/70">
            <p className="leading-relaxed mb-6">
              {isRtl 
                ? 'استكشف آفاقاً جديدة في صناعة المحتوى البصري. عبر منصة NexMedia، نوفر لك القدرة على تحريك أي صورة ثابتة وتحويلها إلى مشهد سينمائي نابض بالحياة بالاعتماد المباشر على أقوى نماذج الفيديو العالمية: Google Veo 3.1 و xAI Grok.'
                : 'Explore new horizons in visual content creation. Through NexMedia, we provide you with the ability to animate any static image and turn it into a vibrant cinematic scene relying directly on the world\'s most powerful video models: Google Veo 3.1 and xAI Grok.'}
            </p>
            
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              {isRtl ? 'النماذج المدعومة في تحريك الصور' : 'Supported Models in Image Animation'}
            </h3>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <div>
                  <strong className="text-white block mb-1">Google Veo 3.1 (Image-to-Video)</strong>
                  <span>{isRtl ? 'يوفر نموذج جوجل Veo دقة غير مسبوقة في فهم تفاصيل الصورة وتحريكها مع الحفاظ على التناسق البصري وجودة 1080p وحركة كاميرا سلسة جداً.' : 'Google Veo model provides unprecedented accuracy in understanding image details and animating them while maintaining visual consistency, 1080p quality, and very smooth camera movement.'}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">✓</span>
                <div>
                  <strong className="text-white block mb-1">xAI Grok Imagine</strong>
                  <span>{isRtl ? 'نموذج متطور من xAI يتميز بإضفاء طابع سينمائي وحيوي على الصور مع قدرة على توليد لقطات طويلة وديناميكية عالية.' : 'An advanced model by xAI characterized by adding a cinematic and vivid touch to images with the ability to generate long shots and high dynamics.'}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
