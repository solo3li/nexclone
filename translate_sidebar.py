import json

ar_json_path = 'NexClone.Backend/Resources/ar.json'

with open(ar_json_path, 'r', encoding='utf-8') as f:
    ar_dict = json.load(f)

translations = {
    "Dashboard": "لوحة القيادة",
    "Users Management": "إدارة المستخدمين",
    "Subscriptions": "الاشتراكات",
    "Pricing &amp; Plans": "باقات الأسعار",
    "Wallet Types": "أنواع المحافظ",
    "Tool Settings": "إعدادات الأدوات",
    "Global Settings": "الإعدادات العامة",
    "Custom Pages": "الصفحات المخصصة",
    "Communication Links": "روابط التواصل",
    "Blog Posts": "منشورات المدونة",
    "Support Tickets": "تذاكر الدعم",
    "Operations History": "سجل العمليات",
    "System Logs": "سجلات النظام",
    "AI Voices": "أصوات الذكاء الاصطناعي",
    "Payment Gateways": "بوابات الدفع",
    "API Keys": "مفاتيح API",
    "Mailing &amp; Emails": "المراسلة والبريد الإلكتروني",
    "Pending Payments": "المدفوعات المعلقة",
    "Payment Methods": "طرق الدفع",
    "All Referrals": "جميع الإحالات",
    "Cash Affiliates": "الشركاء الماليين",
    "Affiliate Payouts": "المدفوعات للشركاء"
}

for key, value in translations.items():
    if key in ar_dict:
        ar_dict[key] = value

with open(ar_json_path, 'w', encoding='utf-8') as f:
    json.dump(ar_dict, f, ensure_ascii=False, indent=4)

print("Translated sidebar items.")
