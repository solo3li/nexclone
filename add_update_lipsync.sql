INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "TitleAr", "DescriptionAr", "CreatedAt")
VALUES (
    gen_random_uuid(),
    'Lip Sync Tool Integration & Wallet Fixes',
    'Added the Lip Sync tool to the main tools dashboard and top navigation menus for easier access. Also resolved an issue with Wallet isolated consumption when assigning multiple plans, ensuring each subscription retains its dedicated balance correctly.',
    'إضافة أداة مزامنة الشفاه وإصلاحات المحافظ',
    'تمت إضافة أداة مزامنة الشفاه (Lip Sync) إلى قائمة الأدوات الرئيسية والقائمة العلوية لتسهيل الوصول إليها. كما تم إصلاح مشكلة تقنية في نظام المحافظ عند إسناد باقات متعددة، لضمان استقلال رصيد كل باقة واستهلاكها بشكل سليم 100%.',
    NOW()
);
