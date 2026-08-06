INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "CreatedAt", "DescriptionAr", "TitleAr")
VALUES (
  gen_random_uuid(),
  'UI Updates & Smart Checkout Fallbacks',
  '<ul><li><strong>Maintenance Badges (Frontend):</strong> Added visual badges for "Maintenance" and "Coming Soon" states directly into the sidebar and navbar to clarify tool availability.</li><li><strong>Advanced Payment Maintenance:</strong> Empowered admins to set "Suspended", "Maintenance", or "Coming Soon" statuses individually for each payment method (Paymob, PayPal, Manual).</li><li><strong>Smart Checkout Fallback UX:</strong> Replaced static payment error messages with an interactive fallback screen featuring social media contact buttons and support ticket links, ensuring zero customer drop-off during payment downtimes.</li><li><strong>Routing Fixes:</strong> Resolved internal route mapping so that frontend UI routes accurately match the database tool configurations for maintenance states.</li></ul>',
  NOW(),
  '<ul><li><strong>علامات الصيانة (واجهة المستخدم):</strong> إضافة علامات بصرية توضح حالة الأدوات (تحت الصيانة، قريباً) في القوائم الجانبية والعلوية لتجربة مستخدم أفضل.</li><li><strong>تحكم متقدم بصيانة الدفع:</strong> تمكين الإدارة من تعيين حالة (موقوف، صيانة، قريباً) لكل طريقة دفع على حدة (Paymob, PayPal, تحويل يدوي).</li><li><strong>تجربة دفع ذكية (الخطة البديلة):</strong> استبدال رسائل الخطأ الثابتة لشاشة الدفع بشاشة تفاعلية تحتوي على روابط التواصل عبر السوشيال ميديا وفتح تذاكر الدعم، لضمان عدم خسارة أي عميل أثناء أعطال الدفع.</li><li><strong>تحسين التوجيه (Routing):</strong> ربط المسارات بشكل دقيق مع قاعدة البيانات لضمان الاستجابة اللحظية لحالة صيانة الأدوات.</li></ul>',
  'تحسينات واجهة المستخدم وتجربة الدفع الذكية'
);
