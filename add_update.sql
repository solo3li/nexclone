INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "TitleAr", "DescriptionAr", "CreatedAt")
VALUES (
    gen_random_uuid(),
    'Multi-Subscription Support & Admin Improvements',
    'Introduced the ability to assign and manage multiple subscriptions for a single user simultaneously. Tool consumption seamlessly handles auto-deduction across active plans, and assigning new plans via the admin panel now properly adds them alongside existing ones without cancellation.',
    'دعم الباقات المتعددة وتحسينات لوحة الإدارة',
    'تمت إضافة إمكانية تعيين وإدارة أكثر من باقة نشطة للمستخدم في نفس الوقت. استهلاك الأدوات الآن يتم بذكاء عبر الباقات المتاحة لتوفير تجربة متصلة. بالإضافة إلى تحسين لوحة الإدارة بحيث تُضاف الباقات الجديدة بشكل طبيعي كباقات فعالة بدلاً من إلغاء الباقات السابقة.',
    NOW()
);
