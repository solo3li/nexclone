"use client";

import { useLanguageStore } from "../store/useLanguageStore";

// Central translations dictionary
const translations = {
  // Common
  "common.loading":        { ar: "جاري التحميل...",     en: "Loading..." },
  "common.save":           { ar: "حفظ التغييرات",       en: "Save changes" },
  "common.saving":         { ar: "جاري الحفظ...",       en: "Saving..." },
  "common.cancel":         { ar: "إلغاء",               en: "Cancel" },
  "common.copy":           { ar: "نسخ",                 en: "Copy" },
  "common.close":          { ar: "إغلاق",               en: "Close" },
  "common.back":           { ar: "رجوع",                en: "Back" },
  "common.all":            { ar: "الكل",                en: "All" },
  "common.soon":           { ar: "قريباً",              en: "Soon" },
  "common.new_project":    { ar: "مشروع جديد",          en: "New project" },
  "common.sign_in":        { ar: "تسجيل الدخول",        en: "Sign in" },
  "common.logout":         { ar: "خروج",                en: "Logout" },

  // Nav
  "nav.tools":             { ar: "الأدوات",             en: "Tools" },
  "nav.plans":             { ar: "الخطط",               en: "Plans" },
  "nav.history":           { ar: "السجل",               en: "History" },
  "nav.settings":          { ar: "الإعدادات",           en: "Settings" },
  "nav.all_tools":         { ar: "عرض كل الأدوات",      en: "Browse all tools" },
  "nav.available_tools":   { ar: "الأدوات المتاحة",     en: "Available tools" },

  // Tool names
  "tool.vtt.title":        { ar: "صوت إلى نص",          en: "Voice to Text" },
  "tool.vtt.desc":         { ar: "نسخ صوتي دقيق",       en: "Accurate transcription" },
  "tool.vtt.long_desc":    { ar: "دقة عالية — يدعم العربية والإنجليزية و30+ لغة.", en: "High accuracy — Arabic, English, and 30+ languages." },
  "tool.vtt.use":          { ar: "استخدم الأداة",        en: "Open tool" },
  "tool.ttv.title":        { ar: "نص إلى صوت",          en: "Text to Voice" },
  "tool.ttv.desc":         { ar: "أصوات طبيعية بالذكاء", en: "Neural AI voices" },
  "tool.ttv.long_desc":    { ar: "أصوات طبيعية بالذكاء الاصطناعي — تعليق صوتي احترافي.", en: "Neural voices — natural, professional voiceovers." },
  "tool.img.title":        { ar: "توليد الصور",          en: "Image Generation" },
  "tool.img.desc":         { ar: "صور إبداعية من نص — جودة 4K.", en: "Creative images from text — 4K quality." },
  "tool.vid.title":        { ar: "توليد الفيديو",        en: "Video Generation" },
  "tool.vid.desc":         { ar: "مقاطع متحركة من نص — سريع وقابل للتعديل.", en: "Animated clips from prompts — fast & editable." },

  // Landing Page
  "landing.hero_badge":      { ar: "مرحباً بك في مستقبل الإبداع", en: "Welcome to the future of creation" },
  "landing.hero_title":      { ar: "الإبداع المدعوم بالذكاء الاصطناعي صار", en: "AI-Powered Creativity Made" },
  "landing.hero_title_hl":   { ar: "أسهل",                    en: "Simple" },
  "landing.hero_sub":        { ar: "منصة شاملة لتحويل الأفكار إلى نصوص، أصوات، وصور بضغطة زر واحدة.", en: "An all-in-one platform to turn ideas into text, voice, and images instantly." },
  "landing.cta_primary":     { ar: "ابدأ مجاناً الآن",       en: "Start for free" },
  "landing.cta_secondary":   { ar: "استكشف الأدوات",         en: "Explore tools" },
  "landing.trusted":         { ar: "موثوق من قبل المبدعين في", en: "Trusted by creators at" },
  "landing.feat_title":      { ar: "كل ما تحتاجه للإبداع.",  en: "Everything you need to create." },
  "landing.feat_sub":        { ar: "أدوات ذكية مصممة لزيادة إنتاجيتك.", en: "Smart tools designed to boost your productivity." },
  "landing.bento_voice":     { ar: "صوت إلى نص",              en: "Voice to Text" },
  "landing.bento_voice_d":   { ar: "دقة تفريغ تصل إلى 99٪",   en: "Up to 99% transcription accuracy" },
  "landing.bento_text":      { ar: "نص إلى صوت",              en: "Text to Voice" },
  "landing.bento_text_d":    { ar: "أصوات بشرية واقعية بـ 30 لغة", en: "Ultra-realistic human voices in 30 languages" },
  "landing.bento_img":       { ar: "توليد الصور",             en: "Image Generation" },
  "landing.bento_img_d":     { ar: "حسّن خيالك بصور 4K",     en: "Enhance your imagination with 4K images" },
  "landing.bento_vid":       { ar: "توليد الفيديو",           en: "Video Generation" },
  "landing.bento_vid_d":     { ar: "انطلق بمقاطع حيوية",      en: "Launch dynamic clips" },
  "landing.stats_speed":     { ar: "10x أسرع",                en: "10x Faster" },
  "landing.stats_speed_d":   { ar: "في إنجاز المهام",         en: "task completion" },
  "landing.stats_acc":       { ar: "+99%",                   en: "99%+" },
  "landing.stats_acc_d":     { ar: "دقة الذكاء الاصطناعي",    en: "AI precision accuracy" },
  "landing.ready":           { ar: "جاهز للبدء؟",             en: "Ready to start?" },
  "landing.ready_sub":       { ar: "انضم إلى آلاف المبدعين وارتقِ بإنتاجيتك.", en: "Join thousands of creators and elevate your productivity." },

  // Home / Dashboard
  "home.title":            { ar: "لوحة التحكم",          en: "Dashboard" },
  "home.subtitle":         { ar: "مراقبة نشاط الذكاء الاصطناعي ومساحة العمل الخاصة بك.", en: "Monitor your AI activity and workspace." },
  "home.workspace":        { ar: "مساحة العمل",          en: "Workspace" },
  "home.welcome":          { ar: "مرحباً بعودتك.",       en: "Welcome back." },
  "home.credit_used":      { ar: "مساحة العمل تعمل بسلاسة. لقد استخدمت 25% من رصيدك هذا الشهر.", en: "Everything is running smoothly. You've used 25% of your monthly credit." },
  "home.operations":       { ar: "العمليات",             en: "Operations" },
  "home.credits":          { ar: "الرصيد",               en: "Credits" },
  "home.time_saved":       { ar: "الوقت الموفر",         en: "Time saved" },
  "home.time_value":       { ar: "45 س",                 en: "45 h" },
  "home.weekly_activity":  { ar: "النشاط الأسبوعي",      en: "Weekly activity" },
  "home.this_week":        { ar: "هذا الأسبوع",          en: "This week" },
  "home.this_month":       { ar: "هذا الشهر",            en: "This month" },
  "home.pro_plan":         { ar: "باقة المحترفين",       en: "Pro plan" },
  "home.monthly_billing":  { ar: "دفع شهري.",            en: "Monthly billing." },
  "home.storage":          { ar: "التخزين",              en: "Storage" },
  "home.manage_billing":   { ar: "إدارة الفوترة",        en: "Manage billing" },
  "home.active":           { ar: "نشط",                  en: "Active" },

  // Voice-to-text
  "vtt.page_title":        { ar: "تحويل الصوت إلى نص",   en: "Voice to Text" },
  "vtt.page_desc":         { ar: "قم بتفريغ الملفات الصوتية إلى نصوص بدقة عالية باستخدام الذكاء الاصطناعي.", en: "Transcribe audio files to text with high accuracy using AI." },
  "vtt.upload_title":      { ar: "رفع ملف صوتي",         en: "Upload audio file" },
  "vtt.upload_desc":       { ar: "MP3, WAV, M4A حتى 50 ميجابايت", en: "MP3, WAV, M4A up to 50MB" },
  "vtt.choose_file":       { ar: "اختر ملف",             en: "Choose file" },
  "vtt.record_live":       { ar: "تسجيل مباشر",          en: "Live recording" },
  "vtt.recording":         { ar: "جاري التسجيل...",      en: "Recording..." },
  "vtt.settings_title":    { ar: "إعدادات التفريغ",      en: "Transcription settings" },
  "vtt.audio_lang":        { ar: "لغة الملف الصوتي",     en: "Audio language" },
  "vtt.output_type":       { ar: "نوع المخرجات",         en: "Output type" },
  "vtt.auto":              { ar: "تلقائي",               en: "Auto" },
  "vtt.arabic":            { ar: "العربية",              en: "Arabic" },
  "vtt.english":           { ar: "الإنجليزية",           en: "English" },
  "vtt.plain_text":        { ar: "نص عادي",              en: "Plain text" },
  "vtt.srt":               { ar: "ترجمة (SRT)",          en: "Subtitle (SRT)" },
  "vtt.start_transcribe":  { ar: "بدء التفريغ",          en: "Start transcription" },
  "vtt.transcribing":      { ar: "جاري التفريغ...",      en: "Transcribing..." },
  "vtt.result":            { ar: "النتيجة",              en: "Result" },

  // Text-to-voice
  "ttv.page_title":        { ar: "تحويل النص إلى صوت",   en: "Text to Voice" },
  "ttv.page_desc":         { ar: "حوّل نصوصك إلى تعليق صوتي احترافي بالذكاء الاصطناعي.", en: "Convert your text to professional AI voiceovers." },

  // Settings
  "settings.title":        { ar: "الإعدادات",            en: "Settings" },
  "settings.subtitle":     { ar: "إدارة حسابك، التفضيلات، ومفاتيح API.", en: "Manage your account, preferences, and API keys." },
  "settings.profile":      { ar: "الملف الشخصي",         en: "Profile" },
  "settings.billing":      { ar: "الفوترة والباقات",     en: "Billing & Plans" },
  "settings.api":          { ar: "مفاتيح API",           en: "API Keys" },
  "settings.notifications":{ ar: "الإشعارات",            en: "Notifications" },
  "settings.profile_info": { ar: "معلومات الملف الشخصي", en: "Profile information" },
  "settings.security":     { ar: "الأمان",               en: "Security" },
  "settings.full_name":    { ar: "الاسم الكامل",         en: "Full name" },
  "settings.email":        { ar: "البريد الإلكتروني",    en: "Email address" },
  "settings.email_note":   { ar: "لا يمكن تغيير البريد الإلكتروني.", en: "Email address cannot be changed." },
  "settings.country":      { ar: "البلد",                en: "Country" },
  "settings.change_photo": { ar: "تغيير الصورة",         en: "Change photo" },
  "settings.curr_password":{ ar: "كلمة المرور الحالية",  en: "Current password" },
  "settings.new_password": { ar: "كلمة المرور الجديدة",  en: "New password" },
  "settings.change_pass":  { ar: "تغيير كلمة المرور",    en: "Change password" },
  "settings.updating":     { ar: "جاري التحديث...",      en: "Updating..." },
  "settings.api_keys_desc":{ ar: "استخدم هذه المفاتيح لمصادقة طلبات API الخاصة بك. لا تشاركها علنًا.", en: "Use these keys to authenticate your API requests. Don't share them publicly." },
  "settings.secret_key":   { ar: "المفتاح السري",        en: "Secret key" },
  "settings.new_key":      { ar: "إنشاء مفتاح جديد",    en: "Generate new key" },
  "settings.manage_sub":   { ar: "إدارة الاشتراك",       en: "Manage subscription" },
  "settings.notif_gen":    { ar: "أرسل لي بريدًا إلكترونيًا عند اكتمال عملية التوليد", en: "Email me when a generation completes" },
  "settings.notif_weekly": { ar: "أرسل لي تقارير الاستخدام الأسبوعية", en: "Send me weekly usage reports" },
  "settings.notif_updates":{ ar: "تحديثات المنتج والنشرات الإخبارية", en: "Product updates and newsletters" },
  "settings.save_prefs":   { ar: "حفظ التفضيلات",       en: "Save preferences" },
  "settings.saving":       { ar: "جاري الحفظ...",       en: "Saving..." },
  "settings.updating":     { ar: "جاري التحديث...",      en: "Updating..." },

  // History
  "history.title":         { ar: "السجل",                en: "History" },
  "history.subtitle":      { ar: "جميع عمليات التوليد السابقة.", en: "All your past generation runs." },
  "history.empty":         { ar: "لا يوجد سجل بعد.",    en: "No history yet." },

  // Pricing
  "pricing.title":         { ar: "خطط بسيطة وشفافة",    en: "Simple, transparent pricing" },
  "pricing.subtitle":      { ar: "اختر الخطة المناسبة. لا رسوم خفية، لا مفاجآت.", en: "Choose your plan. No hidden fees, no surprises." },
  "pricing.label":         { ar: "الأسعار",              en: "Pricing" },
  "pricing.auto_renew":    { ar: "جميع الخطط تشمل تجديداً تلقائياً. يمكنك الإلغاء في أي وقت.", en: "All plans auto-renew. Cancel anytime." },
  "pricing.popular":       { ar: "الأكثر طلباً",         en: "Most popular" },
  "pricing.month":         { ar: "/ شهر",                en: "/ month" },

  // Plans
  "plan.free.name":        { ar: "المجانية",             en: "Free" },
  "plan.free.desc":        { ar: "لتجربة المنصة والبدء.", en: "Get started, no commitment." },
  "plan.free.cta":         { ar: "ابدأ مجاناً",          en: "Get started" },
  "plan.pro.name":         { ar: "المحترفين",            en: "Pro" },
  "plan.pro.desc":         { ar: "للمبدعين وصناع المحتوى.", en: "For serious creators." },
  "plan.pro.cta":          { ar: "ابدأ الآن",            en: "Get Pro" },
  "plan.ent.name":         { ar: "الشركات",              en: "Enterprise" },
  "plan.ent.desc":         { ar: "للفرق والمؤسسات.",     en: "For teams and orgs." },
  "plan.ent.cta":          { ar: "تواصل معنا",           en: "Contact us" },
} as const;

type TranslationKey = keyof typeof translations;

export function useI18n() {
  const { language } = useLanguageStore();
  const isAr = language === "ar";
  const dir = isAr ? "rtl" : "ltr";

  const t = (key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return isAr ? entry.ar : entry.en;
  };

  return { t, isAr, dir, language };
}
