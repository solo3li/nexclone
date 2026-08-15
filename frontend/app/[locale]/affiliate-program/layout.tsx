import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'ar';

  const title = isRtl 
    ? "برنامج التسويق بالعمولة للذكاء الاصطناعي - اربح 20% عمولة متكررة | NexMedia" 
    : "AI Affiliate Program - Earn 20% Recurring Commission | NexMedia";
    
  const description = isRtl 
    ? "انضم إلى أفضل برنامج تسويق بالعمولة (Affiliate Program) في مجال الذكاء الاصطناعي. سوّق لأدوات NexMedia (Veo, Grok, وغيرها) واربح عمولة 20% متكررة شهرياً على كل اشتراك." 
    : "Join the best AI Affiliate Program. Promote NexMedia AI tools (Veo, Grok, etc.) and earn a 20% recurring monthly commission on every subscription.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://nexmedia.ai/${locale}/affiliate-program`,
    },
    alternates: {
      canonical: `https://nexmedia.ai/${locale}/affiliate-program`,
      languages: {
        'en': 'https://nexmedia.ai/en/affiliate-program',
        'ar': 'https://nexmedia.ai/ar/affiliate-program',
      }
    }
  };
}

export default function AffiliateProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
