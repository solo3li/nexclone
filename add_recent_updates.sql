INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "TitleAr", "DescriptionAr", "CreatedAt")
VALUES 
(gen_random_uuid(), 
'Enhanced Payment System & Success Pages', 
'Upgraded the checkout experience by separating payment methods into distinct tabs (Card, Wallet, Manual). Added dynamic currency selection (EGP/USD) within the checkout modal to determine available payment gateways. Implemented a professional, animated payment success page. Improved Paymob backend integration for mobile wallets support.', 
'تحديث نظام الدفع وصفحة النجاح', 
'تم تحسين تجربة الدفع من خلال فصل طرق الدفع في نوافذ مستقلة (بطاقات، محافظ إلكترونية، تحويل يدوي). تمت إضافة اختيار العملة الديناميكي (جنيه/دولار) داخل نافذة الدفع لتحديد البوابات المتاحة تلقائياً. تم إنشاء صفحة نجاح دفع احترافية متحركة، وتم إصلاح وضبط دمج المحافظ الإلكترونية لبوابات باي موب.', 
NOW());
