INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "TitleAr", "DescriptionAr", "CreatedAt")
VALUES (
    gen_random_uuid(),
    'User Profile & Admin Invoicing Enhancements',
    '<ul><li><strong>Enhanced Profile Invoices Page:</strong> The user profile invoices page now displays active subscription details and usage statistics alongside the invoices list, providing a complete billing dashboard.</li><li><strong>Admin Panel Invoices:</strong> Administrators can now view and download PDF tax invoices directly from the Subscription Details page in the Admin Panel.</li></ul>',
    'تحسينات الفواتير في الملف الشخصي ولوحة الإدارة',
    '<ul><li><strong>صفحة الفواتير المطورة:</strong> تم تحسين صفحة الفواتير في الملف الشخصي لتعرض تفاصيل الاشتراك النشط وإحصائيات الاستخدام بجانب قائمة الفواتير، لتصبح لوحة تحكم متكاملة للاشتراكات.</li><li><strong>فواتير لوحة الإدارة:</strong> أصبح بإمكان الإدارة عرض وتحميل الفواتير الضريبية بصيغة PDF مباشرة من صفحة تفاصيل الاشتراك في لوحة تحكم الإدارة.</li></ul>',
    NOW()
);
