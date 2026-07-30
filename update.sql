INSERT INTO "SystemUpdates" ("Id", "TitleEn", "DescriptionEn", "CreatedAt", "DescriptionAr", "TitleAr")
VALUES (
  gen_random_uuid(),
  'Background Tasks & Real-time Notifications (RabbitMQ & SignalR)',
  '<ul><li><strong>RabbitMQ Background Jobs:</strong> Migrated Text-to-Voice and Voice-to-Text tools to use RabbitMQ for processing tasks in the background instead of blocking the UI.</li><li><strong>SignalR Real-time Notifications:</strong> Added real-time pop-up notifications to alert users instantly when their background tasks (Audio Generation, Transcription, Avatar Video) are completed.</li><li><strong>Wait & Leave UX:</strong> Implemented a modern experience allowing users to safely leave the page during long processing and check the results later in the History page.</li></ul>',
  NOW(),
  '<ul><li><strong>مهام خلفية عبر RabbitMQ:</strong> تم نقل أدوات (تحويل النص لصوت) و (تحويل الصوت لنص) لتعمل في الخلفية بدلاً من تعطيل المتصفح أثناء الانتظار.</li><li><strong>إشعارات لحظية SignalR:</strong> إضافة إشعارات منبثقة لحظية لتنبيه المستخدم فور اكتمال مهامه (توليد الصوت، تحليل الصوت، الأفاتار).</li><li><strong>تجربة استخدام سلسة (Wait & Leave):</strong> توفير تجربة حديثة تتيح للمستخدم مغادرة الصفحة أثناء المعالجة الطويلة والعودة للنتيجة لاحقاً عبر سجل العمليات (History).</li></ul>',
  'المهام الخلفية والإشعارات اللحظية (RabbitMQ و SignalR)'
);
