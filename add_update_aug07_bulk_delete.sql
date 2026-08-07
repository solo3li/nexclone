INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "CreatedAt", "DescriptionAr", "TitleAr")
VALUES (
  gen_random_uuid(),
  'Admin Panel Bulk Operations',
  '<ul><li><strong>Bulk Delete Users:</strong> Added multi-select checkboxes to the Users Management page for efficiently deleting multiple users at once.</li><li><strong>Bulk Delete Subscriptions:</strong> Implemented batch deletion in the User Subscriptions view.</li><li><strong>Bulk Delete Plans:</strong> Added multi-select deletion support for Subscription Plans Management.</li><li><strong>Improved Workflows:</strong> All bulk actions feature confirmation safeguards and seamless AJAX integration to prevent page reload interruptions.</li></ul>',
  NOW(),
  '<ul><li><strong>الحذف المتعدد للمستخدمين:</strong> تم إضافة خيار التحديد المتعدد للحذف في صفحة إدارة المستخدمين لتسريع وتسهيل العمليات الإدارية.</li><li><strong>الحذف المتعدد للاشتراكات:</strong> تم تفعيل الحذف الجماعي في صفحة إدارة اشتراكات المستخدمين.</li><li><strong>الحذف المتعدد للباقات:</strong> دعم الحذف المتعدد في صفحة إدارة باقات الاشتراك.</li><li><strong>تحسين سير العمل:</strong> جميع عمليات الحذف تتضمن رسائل تأكيد مسبقة وتعتمد على تقنية AJAX لضمان الاستجابة السريعة دون إعادة تحميل الصفحة.</li></ul>',
  'عمليات الإدارة الجماعية في لوحة التحكم'
);
