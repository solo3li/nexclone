INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "TitleAr", "DescriptionAr", "CreatedAt")
VALUES (
    gen_random_uuid(),
    'Professional Invoicing & Subscription Tracking',
    '<ul><li><strong>Automated PDF Invoices:</strong> Introduced automated, highly professional PDF invoice generation for all successful subscription payments.</li><li><strong>Tax Percentage Configuration:</strong> Added the ability to set specific tax percentages for each plan from the Admin Panel.</li><li><strong>QR Code Verification:</strong> Each invoice includes a QR code that links directly to a verification page to prove authenticity.</li><li><strong>My Invoices Hub:</strong> A new section in the User Profile allowing users to view, track, and download their tax invoices anytime.</li></ul>',
    'نظام الفواتير الاحترافي وتتبع الاشتراكات',
    '<ul><li><strong>فواتير PDF تلقائية:</strong> تمت إضافة ميزة إصدار فواتير ضريبية PDF بتصميم احترافي تلقائياً فور نجاح عملية الدفع.</li><li><strong>تخصيص نسبة الضريبة:</strong> أصبح بإمكان الإدارة تحديد نسبة الضريبة (Tax Percentage) بشكل منفصل لكل باقة من لوحة التحكم.</li><li><strong>التحقق عبر QR Code:</strong> كل فاتورة مزودة برمز استجابة سريعة (QR Code) يوجه لصفحة تحقق رسمية لإثبات صحة الفاتورة.</li><li><strong>قسم الفواتير:</strong> إضافة قسم جديد "فواتيري" داخل الملف الشخصي يتيح للمستخدم استعراض وتحميل فواتيره في أي وقت.</li></ul>',
    NOW()
);
