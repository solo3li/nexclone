using System;
using System.Globalization;

namespace NexClone.Backend.Application.Services
{
    public class EmailTemplateService : IEmailTemplateService
    {
        public string GetSubscriptionReceiptEmail(
            string userName, 
            string planName, 
            DateTime startDate, 
            DateTime endDate, 
            decimal monthlyCredits, 
            decimal amountPaid = 0m,
            string invoiceUrl = "")
        {
            var culture = new CultureInfo("ar-EG");
            string formattedStartDate = startDate.ToString("dd MMMM yyyy, hh:mm tt", culture);
            string formattedEndDate = endDate.ToString("dd MMMM yyyy, hh:mm tt", culture);
            string formattedAmount = amountPaid > 0 ? $"{amountPaid:N2} ج.م" : "مجاناً";

            string invoiceSection = string.IsNullOrEmpty(invoiceUrl) ? "" : $@"
            <div style=""text-align: center; margin-top: 30px;"">
                <p style=""font-size: 16px; color: #555;"">يمكنك تحميل وطباعة الفاتورة الضريبية الخاصة بك من هنا:</p>
                <a href=""{invoiceUrl}"" style=""display: inline-block; padding: 12px 25px; background-color: #6366f1; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);"">📄 عرض الفاتورة (PDF)</a>
            </div>";

            return $@"
<!DOCTYPE html>
<html lang=""ar"" dir=""rtl"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>تفاصيل الاشتراك - NexMedia AI</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            color: #333;
            direction: rtl;
            text-align: right;
        }}
        .container {{
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }}
        .header {{
            background-color: #161616;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
        }}
        .header p {{
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }}
        .content {{
            padding: 40px 30px;
        }}
        .greeting {{
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #222;
        }}
        .message {{
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 30px;
        }}
        .details-box {{
            background-color: #f8faff;
            border: 1px solid #e1e8f0;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 30px;
        }}
        .details-box h2 {{
            margin: 0 0 20px;
            font-size: 18px;
            color: #161616;
            border-bottom: 2px solid #6366f1;
            display: inline-block;
            padding-bottom: 5px;
        }}
        .detail-item {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 15px;
        }}
        .detail-item:last-child {{
            margin-bottom: 0;
        }}
        .detail-label {{
            font-weight: 600;
            color: #555;
        }}
        .detail-value {{
            font-weight: 700;
            color: #222;
        }}
        .amount-highlight {{
            color: #10b981;
            font-size: 18px;
        }}
        .footer {{
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #eee;
        }}
        .footer a {{
            color: #6366f1;
            text-decoration: none;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>NexMedia AI</h1>
            <p>تم تفعيل اشتراكك بنجاح</p>
        </div>
        <div class=""content"">
            <div class=""greeting"">مرحباً {userName}،</div>
            <div class=""message"">
                شكراً لاختيارك NexMedia AI. يسعدنا إخبارك بأنه تم تفعيل اشتراكك في باقة <strong>{planName}</strong> بنجاح. أنت الآن مستعد للبدء في استخدام أدوات الذكاء الاصطناعي الخاصة بنا.
            </div>
            
            <div class=""details-box"">
            </p>

        </div>
        <div class=""footer"">
            <p>هذه رسالة تلقائية، يرجى عدم الرد عليها.</p>
            <p>&copy; {DateTime.UtcNow.Year} NexMedia AI. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>";
        }

        public string GetGracePeriodEmail(string userName, string planName, int gracePeriodDays)
        {
            return $@"
<!DOCTYPE html>
<html lang=""ar"" dir=""rtl"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>تنبيه فترة السماح - NexMedia AI</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            color: #333;
            direction: rtl;
            text-align: right;
        }}
        .container {{
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }}
        .header {{
            background-color: #161616;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }}
        .header p {{
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }}
        .content {{
            padding: 30px;
        }}
        .welcome {{
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
        }}
        .alert-box {{
            background-color: #fff3cd;
            border-right: 4px solid #ffc107;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 8px;
            color: #856404;
        }}
        .highlight {{
            color: #0f62fe;
            font-weight: bold;
        }}
        .footer {{
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }}
        .btn {{
            display: inline-block;
            background-color: #0f62fe;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 10px;
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>NexMedia AI</h1>
            <p>تنبيه: باقتك في فترة السماح</p>
        </div>
        <div class=""content"">
            <div class=""welcome"">مرحباً {userName}،</div>
            <p style=""line-height: 1.6; margin-bottom: 20px;"">
                نود إعلامك بأن مدة باقتك الحالية <span class=""highlight"">{planName}</span> قد انتهت.
            </p>
            <div class=""alert-box"">
                <strong>أنت الآن في فترة السماح!</strong><br><br>
                لديك <strong>{gracePeriodDays} أيام</strong> إضافية لتجديد اشتراكك قبل أن يتم إيقاف الباقة وتصفير رصيدك (الكريدتس) المتبقي.
            </div>
            <p style=""line-height: 1.6;"">
                للحفاظ على رصيدك والاستمرار في التمتع بخدمات الذكاء الاصطناعي، يرجى تسجيل الدخول وتجديد باقتك في أقرب وقت.
            </p>
        </div>
        <div class=""footer"">
            <p>هذه رسالة تلقائية، يرجى عدم الرد عليها.</p>
            <p>&copy; {DateTime.UtcNow.Year} NexMedia AI. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>";
        }

        public string GetSubscriptionExpiredEmail(string userName, string planName)
        {
            return $@"
<!DOCTYPE html>
<html lang=""ar"" dir=""rtl"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>انتهاء صلاحية الباقة - NexMedia AI</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            color: #333;
            direction: rtl;
            text-align: right;
        }}
        .container {{
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }}
        .header {{
            background-color: #161616;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }}
        .header p {{
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }}
        .content {{
            padding: 30px;
        }}
        .welcome {{
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
        }}
        .alert-box {{
            background-color: #f8d7da;
            border-right: 4px solid #dc3545;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 8px;
            color: #721c24;
        }}
        .highlight {{
            color: #dc3545;
            font-weight: bold;
        }}
        .footer {{
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }}
        .btn {{
            display: inline-block;
            background-color: #0f62fe;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 10px;
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>NexMedia AI</h1>
            <p>انتهت صلاحية باقتك</p>
        </div>
        <div class=""content"">
            <div class=""welcome"">مرحباً {userName}،</div>
            <div class=""alert-box"">
                <strong>انتهت فترة السماح لباقتك!</strong><br><br>
                لقد انتهت فترة السماح لباقتك <span class=""highlight"">{planName}</span> وتم إيقاف الباقة وتصفير رصيد حسابك.
            </div>
            <p style=""line-height: 1.6;"">
                نأمل أن تكون قد استمتعت بخدماتنا. لا يزال بإمكانك العودة والاستمتاع بأدوات الذكاء الاصطناعي من خلال الاشتراك في إحدى باقاتنا المتاحة.
            </p>
        </div>
        <div class=""footer"">
            <p>هذه رسالة تلقائية، يرجى عدم الرد عليها.</p>
            <p>&copy; {DateTime.UtcNow.Year} NexMedia AI. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
