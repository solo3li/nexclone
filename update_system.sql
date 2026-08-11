INSERT INTO "SystemUpdates" ("Title", "TitleAr", "Description", "DescriptionAr", "Version", "ReleaseDate", "IsVisible")
VALUES (
    'Massive Platform Overhaul & AI Capabilities',
    'تحديث شامل للمنصة وإمكانيات الذكاء الاصطناعي',
    '<ul>
      <li><strong>Background Jobs & Stability:</strong> Integrated Hangfire for independent AI processing and achieved 100% frontend test coverage.</li>
      <li><strong>New AI Tools:</strong> Launched Text-to-Voice, Voice-to-Text, Image-to-Text, and GPT Assistant.</li>
      <li><strong>Advanced Video Editor:</strong> Introduced a fully-featured non-linear timeline editor with stock media search and 3D depth estimation.</li>
      <li><strong>Billing & Subscriptions:</strong> Added Paymob & PayPal integrations with dynamic credit consumption and plan limits.</li>
      <li><strong>Modern UI Redesign:</strong> Completely overhauled the interface using a sleek Bento Grid design, complete with a real-time analytics dashboard.</li>
      <li><strong>Legacy Cleanup & TTS Migration:</strong> Stripped out old RabbitMQ and dynamic wallet logic in favor of a streamlined credits system. Successfully migrated Text-To-Speech database profiles and parameters to the new system.</li>
    </ul>',
    '<ul>
      <li><strong>معالجة المهام واستقرار النظام:</strong> دمج نظام Hangfire لمعالجة أدوات الذكاء الاصطناعي في الخلفية، وتحقيق تغطية اختبارات بنسبة 100% لواجهة المستخدم.</li>
      <li><strong>أدوات ذكاء اصطناعي جديدة:</strong> إطلاق أدوات تحويل النص إلى صوت، والصوت إلى نص، والصورة إلى نص، ومساعد GPT.</li>
      <li><strong>محرر فيديو متقدم:</strong> تقديم محرر فيديو متكامل يدعم الطبقات المتعددة مع بحث في مكتبات الوسائط وتقدير العمق ثلاثي الأبعاد.</li>
      <li><strong>المدفوعات والاشتراكات:</strong> دمج بوابات الدفع Paymob و PayPal مع نظام مرن لاستهلاك الأرصدة وباقات الاشتراك.</li>
      <li><strong>تصميم عصري جديد:</strong> إعادة تصميم واجهة المستخدم بالكامل باستخدام نظام Bento Grid الأنيق، مع لوحة تحكم تفاعلية للإحصائيات الحية.</li>
      <li><strong>تحديث الأنظمة القديمة وترحيل البيانات:</strong> إزالة البنية التحتية القديمة مثل RabbitMQ والمحافظ الديناميكية واستبدالها بنظام أرصدة مبسط. تم بنجاح ترحيل ملفات الصوت وبارامترات تحويل النص إلى كلام لقاعدة البيانات الجديدة.</li>
    </ul>',
    'v2.0.0',
    CURRENT_TIMESTAMP,
    true
);
