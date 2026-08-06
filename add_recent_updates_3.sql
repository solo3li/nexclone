INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "TitleAr", "DescriptionAr", "CreatedAt")
VALUES 
(gen_random_uuid(), 
'Wallet Balances in Subscriptions Panel', 
'Updated the Subscriptions view in the Admin Panel to display the exact balance of all user wallets in a detailed modal, matching the User Management view. This provides admins with better visibility into user credit balances.', 
'أرصدة المحافظ في لوحة الاشتراكات', 
'تم تحديث صفحة الاشتراكات في لوحة التحكم لعرض الرصيد الدقيق لجميع محافظ المستخدم في نافذة تفصيلية، ليتطابق مع صفحة إدارة المستخدمين. يوفر هذا للمسؤولين رؤية أوضح لأرصدة المشتركين.', 
NOW()),
(gen_random_uuid(),
'Enhanced Pricing UI Buttons',
'Upgraded the design of the "Pay in EGP" and "Pay in USD" buttons on the pricing page. The buttons now feature a more professional, premium look with matching brand gradients, icons, and dynamic hover effects to improve user engagement.',
'تحسين تصميم أزرار الدفع في الباقات',
'تم تحديث تصميم أزرار "دفع بالجنيه" و"دفع بالدولار" في صفحة الباقات لتكون أكثر احترافية ومتميزة، مع ألوان وتدرجات متناسقة مع هوية الموقع، إضافة إلى أيقونات وتأثيرات بصرية جذابة لتحسين تجربة المستخدم.',
NOW());
