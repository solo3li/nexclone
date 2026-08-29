"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

interface BlogPost {
  id: number;
  slug: string;
  category: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  createdAt: string;
}

export default function BlogIndex() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/client/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch posts', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center">
          {isRtl ? 'المدونة وآخر التحديثات' : 'Blog & Latest Updates'}
        </h1>
        <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
          {isRtl 
            ? 'اكتشف كيف يمكن للذكاء الاصطناعي تغيير طريقتك في صناعة المحتوى عبر أحدث المقالات.' 
            : 'Discover how AI can transform your content creation through our latest articles.'}
        </p>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-white/50 py-12">
            {isRtl ? 'لا توجد مقالات حالياً.' : 'No posts available right now.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}` as any} key={post.id} className="block group">
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                  
                  {/* Decorative Header */}
                  <div className="w-full h-40 bg-gradient-to-br from-violet-900/40 to-fuchsia-900/40 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                     <span className="text-violet-400/50 text-5xl font-black italic mix-blend-overlay">AI</span>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                      <span>{new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}</span>
                      <span className="px-2 py-1 rounded bg-white/5 text-fuchsia-400/80">{post.category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors leading-snug">
                      {isRtl ? post.titleAr : post.titleEn}
                    </h2>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4 flex-1">
                      {(isRtl ? post.contentAr : post.contentEn).replace(/<[^>]*>?/gm, '')}
                    </p>
                    <span className="text-violet-400 font-semibold text-sm flex items-center gap-1">
                      {isRtl ? 'اقرأ المزيد ←' : 'Read More →'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
