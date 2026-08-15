"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { use } from "react";
import { useLocale } from "next-intl";
import { blogArticles } from "@/data/blogData";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const post = blogArticles.find(p => p.slug === id);
  const ArrowIcon = isRtl ? ArrowRight : ArrowLeft;

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0015] flex flex-col font-sans text-center justify-center items-center">
        <h1 className="text-4xl text-white font-bold mb-4">{isRtl ? 'المقال غير موجود' : 'Post Not Found'}</h1>
        <Link href="/blog" className="text-violet-400 hover:underline">
          {isRtl ? 'العودة للمدونة' : 'Return to Blog'}
        </Link>
      </div>
    );
  }

  const title = isRtl ? post.titleAr : post.titleEn;
  const content = isRtl ? post.contentAr : post.contentEn;

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-32 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowIcon className="w-4 h-4" />
          <span>{isRtl ? 'العودة للمدونة' : 'Back to Blog'}</span>
        </Link>
        
        <article className="prose prose-invert prose-violet max-w-none">
          <div className="flex items-center gap-4 text-white/50 text-sm mb-6 font-medium">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {new Date(post.date).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
            <span className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">{post.category}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-10 leading-tight">
            {title}
          </h1>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 text-white/80 leading-loose text-lg"
               dangerouslySetInnerHTML={{ __html: content }} />
        </article>

        {/* SEO Hidden Box for internal linking */}
        <div className="mt-16 p-6 rounded-2xl bg-fuchsia-900/10 border border-fuchsia-500/20">
           <h3 className="text-xl font-bold text-white mb-2">{isRtl ? 'هل أنت مستعد لصناعة السحر؟' : 'Ready to create magic?'}</h3>
           <p className="text-white/60 mb-4">
             {isRtl ? 'استخدم نماذج NexMedia المدعومة بـ Veo و Grok وابدأ تجربتك الآن.' : 'Use NexMedia models powered by Veo and Grok and start your trial now.'}
           </p>
           <Link href="/tools" className="inline-block bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
             {isRtl ? 'توليد فيديو الآن' : 'Generate Video Now'}
           </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
