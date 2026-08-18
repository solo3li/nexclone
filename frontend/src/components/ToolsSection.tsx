"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import {
  Mic,
  Volume2,
  Scissors,
  PenTool,
  ArrowLeft,
  ArrowRight,
  Video,
  Smile,
  Film,
  Layers,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import { AnimatedText, AnimatedReveal } from "./AnimatedText";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "../i18n/routing";
import { useAppStore } from "../store/useAppStore";
import { resolveToolStatus } from "../utils/toolStatus";

type Tool = {
  icon: any;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  iconBg: string;
  glowColor: string;
  tags: string[];
  image: string;
  href?: string;
};

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const t = useTranslations("Tools");
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const Icon = tool.icon;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const { toolConfigs } = useAppStore();
  const statusInfo = resolveToolStatus(tool.href || '', toolConfigs);

  const displayBadge = statusInfo.isMaintenanceMode 
    ? (isRtl ? 'تحت التحديث' : 'Maintenance')
    : statusInfo.isComingSoon 
      ? (isRtl ? 'قريباً' : 'Coming Soon')
      : tool.badge;

  const displayBadgeColor = statusInfo.isMaintenanceMode
    ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
    : statusInfo.isComingSoon
      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
      : tool.badgeColor;

  const ctaText = statusInfo.isMaintenanceMode
    ? (isRtl ? 'تحت التحديث' : 'Maintenance')
    : statusInfo.isComingSoon
      ? (isRtl ? 'قريباً' : 'Coming Soon')
      : t('useTool');

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const bgX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const bgY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const background = useMotionTemplate`radial-gradient(circle at ${bgX}% ${bgY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      onClick={() => tool.href && router.push(tool.href)}
      className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] flex flex-col h-full"
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background }}
      />

      {/* Hover gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500" />

      {/* Glow effect */}
      <div
        className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl ${tool.glowColor}`}
      />

      {/* Cover Image Container */}
      <div className="relative h-44 w-full overflow-hidden shrink-0 z-0 border-b border-white/10 bg-[#0a0015]/50">
        <Image
          src={tool.image}
          alt={tool.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d011a] via-transparent to-transparent opacity-80" />
      </div>

      <div className="relative p-5 z-10 flex flex-col flex-grow -mt-5" style={{ transform: "translateZ(30px)" }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div
              className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${tool.iconBg} opacity-0 group-hover:opacity-40 blur-md transition-all duration-300 animate-pulse`}
            />
          </div>
          {displayBadge && (
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${displayBadgeColor}`}
            >
              {displayBadge}
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-violet-200 transition-colors duration-300">
          {tool.title}
        </h3>
        <p className="text-white/50 text-xs leading-relaxed mb-4 group-hover:text-white/70 transition-colors duration-300 flex-grow">
          {tool.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-white/50 border border-white/10 group-hover:border-white/20 group-hover:text-white/80 group-hover:bg-white/20 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-violet-400 text-xs font-medium group-hover:gap-2.5 transition-all duration-300 relative inline-flex mt-auto">
          <span>{ctaText}</span>
          <ArrowIcon className={`w-3.5 h-3.5 transition-transform duration-300 ${locale === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-violet-400/0 group-hover:bg-violet-400/50 transition-colors duration-300" />
        </div>
      </div>
    </motion.div>
  );
}

export default function ToolsSection() {
  const t = useTranslations("Tools");
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { toolConfigs, fetchToolConfigs } = useAppStore();

  useEffect(() => {
    if (!toolConfigs) {
      fetchToolConfigs();
    }
  }, [toolConfigs, fetchToolConfigs]);

  const tools: Tool[] = [
    {
      icon: Film,
      title: isRtl ? 'تحويل النص إلى فيديو' : 'Text to Video',
      desc: isRtl ? 'اصنع فيديوهات سينمائية فائقة الجودة من مجرد وصف نصي باستخدام أحدث نماذج الفيديو.' : 'Create ultra-high-definition cinematic videos directly from text prompts.',
      badge: isRtl ? 'سينمائي' : 'Cinematic',
      badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      gradient: "from-violet-600/20 to-purple-600/10",
      iconBg: "from-violet-500 to-purple-600",
      glowColor: "shadow-violet-500/20",
      tags: isRtl ? ['فيديو', 'نص', 'سينما'] : ['Video', 'Text', 'Cinema'],
      image: "/images/tool-text2video.jpg",
      href: "/tools/text-to-video"
    },
    {
      icon: Video,
      title: isRtl ? 'تحويل الصورة إلى فيديو' : 'Image to Video',
      desc: isRtl ? 'حوّل صورك وشخصياتك الثابتة إلى فيديوهات متحركة ومذهلة بضغطة زر.' : 'Animate your static portraits and images into stunning, dynamic videos.',
      badge: isRtl ? 'متحرك' : 'Animated',
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      gradient: "from-blue-600/20 to-indigo-600/10",
      iconBg: "from-blue-500 to-indigo-600",
      glowColor: "shadow-blue-500/20",
      tags: isRtl ? ['افتار', 'صورة', 'فيديو'] : ['Avatar', 'Image', 'Video'],
      image: "/images/tool-img2avatar.png",
      href: "/tools/image-to-video"
    },
    {
      icon: Layers,
      title: isRtl ? 'صور مرجعية لفيديو' : 'Reference to Video',
      desc: isRtl ? 'أنشئ فيديوهات متناسقة ومطابقة لشخصيتك المرجعية عبر لقطات وحركات سينمائية متعددة.' : 'Generate consistent character video animations matching reference stills.',
      badge: isRtl ? 'احترافي' : 'Pro',
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      gradient: "from-indigo-600/20 to-cyan-600/10",
      iconBg: "from-indigo-500 to-cyan-600",
      glowColor: "shadow-indigo-500/20",
      tags: isRtl ? ['مرجع', 'شخصيات', 'فيديو'] : ['Reference', 'Character', 'Video'],
      image: "/images/tool-ref2video.jpg",
      href: "/tools/reference-to-video"
    },
    {
      icon: Smile,
      title: isRtl ? 'مزامنة الشفاه المتقدمة' : 'Advanced Lip-Sync',
      desc: isRtl ? 'قم بمزامنة حركة الشفاه بدقة متناهية مع أي ملف صوتي أو تعليق صوتي.' : 'Flawlessly synchronize facial and lip movements with any audio track.',
      badge: isRtl ? 'شائع' : 'Popular',
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      gradient: "from-rose-600/20 to-red-600/10",
      iconBg: "from-rose-500 to-red-600",
      glowColor: "shadow-rose-500/20",
      tags: isRtl ? ['فيديو', 'صوت', 'تزامن'] : ['Video', 'Audio', 'Sync'],
      image: "/images/tool-lipsync.png",
      href: "/tools/advanced-lip-sync"
    },
    {
      icon: Video,
      title: isRtl ? 'نسخ والتحكم بالحركة' : 'Motion Transfer',
      desc: isRtl ? 'انسخ حركة شخص من فيديو مرجعي وطبقها على أي صورة شخصية أو كرتونية.' : 'Transfer complex motion from reference video onto any static character.',
      badge: isRtl ? 'جديد' : 'New',
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      gradient: "from-cyan-600/20 to-blue-600/10",
      iconBg: "from-cyan-500 to-blue-600",
      glowColor: "shadow-cyan-500/20",
      tags: isRtl ? ['فيديو', 'حركة', 'Kling'] : ['Video', 'Motion', 'Kling'],
      image: "/images/tool-motion-control.png",
      href: "/tools/motion-control"
    },
    {
      icon: ImageIcon,
      title: isRtl ? 'توليد الصور من النص' : 'Text to Image',
      desc: isRtl ? 'حوّل أفكارك وخيالك إلى لوحات فنية وتصميمات فوتوغرافية فائقة الجودة والجمال.' : 'Transform your creative prompts into photorealistic artworks and visuals.',
      badge: isRtl ? 'إبداعي' : 'Creative',
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      gradient: "from-amber-600/20 to-orange-600/10",
      iconBg: "from-amber-500 to-orange-600",
      glowColor: "shadow-amber-500/20",
      tags: isRtl ? ['صور', 'تصميم', 'فن'] : ['Images', 'Design', 'Art'],
      image: "/images/tool-text2image.jpg",
      href: "/tools/text-to-image"
    },
    {
      icon: Volume2,
      title: isRtl ? 'تحويل النص إلى صوت' : 'Text to Voice',
      desc: isRtl ? 'توليد تعليق صوتي واقعي بنبرات ومشاعر بشرية طبيعية بأكثر من 40 لغة ولهجة.' : 'Convert text into natural, emotive, human-like voiceovers in 40+ languages.',
      badge: isRtl ? 'طبيعي' : 'Ultra-Realistic',
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      gradient: "from-emerald-600/20 to-teal-600/10",
      iconBg: "from-emerald-500 to-teal-600",
      glowColor: "shadow-emerald-500/20",
      tags: isRtl ? ['صوت', 'دبلجة', 'TTS'] : ['Audio', 'Voiceover', 'TTS'],
      image: "/images/tool-tts.png",
      href: "/tools/text-to-voice"
    },
    {
      icon: Mic,
      title: isRtl ? 'تحويل الصوت إلى نص' : 'Voice to Text',
      desc: isRtl ? 'تفريغ وترجمة التسجيلات الصوتية ومقاطع الفيديو إلى نصوص دقيقة بنقرة واحدة.' : 'Transcribe and translate any audio or video recordings into accurate text.',
      badge: isRtl ? 'دقة عالية' : 'Accurate',
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      gradient: "from-teal-600/20 to-emerald-600/10",
      iconBg: "from-teal-500 to-emerald-600",
      glowColor: "shadow-teal-500/20",
      tags: isRtl ? ['تفريغ', 'ترجمة', 'نص'] : ['Transcribe', 'Subtitle', 'STT'],
      image: "/images/tool-vtt.png",
      href: "/tools/voice-to-text"
    }
  ];

  return (
    <section id="tools" className="relative py-24 bg-[#0a0015]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <AnimatedReveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-4">
              <Scissors className="w-3.5 h-3.5" />
              {t('badge')}
            </span>
          </AnimatedReveal>

          <AnimatedText
            text={t('title')}
            as="h2"
            delay={0.1}
            className="text-3xl sm:text-5xl font-extrabold text-white mb-4"
          />

          <AnimatedReveal delay={0.2}>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </AnimatedReveal>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {tools.map((tool, index) => (
            <div key={tool.href} className="w-full h-full">
              <ToolCard tool={tool} index={index} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatedReveal delay={0.3} className="text-center mt-14">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-lg transition-all duration-300 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50"
          >
            <PenTool className="w-5 h-5" />
            {t('startUsing')}
          </Link>
        </AnimatedReveal>
      </div>
    </section>
  );
}

