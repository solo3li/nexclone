INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "TitleAr", "DescriptionAr", "CreatedAt")
VALUES 
(gen_random_uuid(), 
'PayPal Guest Checkout Optimization', 
'Optimized the PayPal integration to force the "Guest Checkout" option. Customers can now directly pay using their Visa or Mastercard through PayPal without being forced to log in or create a PayPal account, improving conversion rates.', 
'تحسين الدفع عبر بايبال للبطاقات', 
'تم تحسين ربط الدفع عبر بايبال ليظهر خيار "الدفع كضيف" بشكل افتراضي. الآن يمكن للعملاء الدفع مباشرة باستخدام بطاقات فيزا وماستركارد عبر بايبال دون الحاجة لتسجيل الدخول أو إنشاء حساب بايبال، مما يسهل عملية الدفع.', 
NOW());
