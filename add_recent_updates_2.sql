INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "TitleAr", "DescriptionAr", "CreatedAt")
VALUES 
(gen_random_uuid(), 
'Simplified Plan Subscription UI', 
'Improved the pricing page by replacing the single "Subscribe" button with direct "Pay in EGP" and "Pay in USD" buttons for paid plans. This provides a more straightforward checkout experience for users, allowing them to explicitly select their preferred payment currency upfront.', 
'تبسيط واجهة الاشتراك في الباقات', 
'تم تحسين صفحة الباقات من خلال استبدال زر "الاشتراك" الفردي بـزرين مباشرين: "دفع بالجنيه" و"دفع بالدولار" للباقات المدفوعة. هذا يوفر تجربة إتمام دفع أسهل وأكثر وضوحاً للمستخدمين، مما يسمح لهم بتحديد عملة الدفع المفضلة لديهم مباشرة قبل الانتقال لنافذة الدفع.', 
NOW());
