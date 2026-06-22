import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function CustomPage({ params }: { params: { locale: string; slug: string } }) {
  const { locale, slug } = params;
  
  let page = null;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const res = await fetch(`${apiUrl}/api/platform/custom-page/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      return notFound();
    }
    page = await res.json();
  } catch (err) {
    return notFound();
  }

  const title = locale === 'ar' ? page.titleAr : page.titleEn;
  const content = locale === 'ar' ? page.contentAr : page.contentEn;

  return (
    <div className="min-h-screen bg-[#0a0015] flex flex-col" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-32 text-gray-300 leading-relaxed">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12 text-center">{title}</h1>
        <div className="prose prose-invert prose-violet max-w-none bg-white/5 border border-white/10 p-8 rounded-3xl" dangerouslySetInnerHTML={{ __html: content }} />
      </main>
      <Footer />
    </div>
  );
}
