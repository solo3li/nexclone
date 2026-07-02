using System;
using System.Globalization;

namespace NexClone.Backend.Services
{
    public class EmailTemplateService : IEmailTemplateService
    {
        public string GetSubscriptionReceiptEmail(
            string userName, 
            string planName, 
            DateTime startDate, 
            DateTime endDate, 
            decimal monthlyCredits, 
            decimal amountPaid = 0m)
        {
            var culture = new CultureInfo("ar-EG");
            string formattedStartDate = startDate.ToString("dd MMMM yyyy, hh:mm tt", culture);
            string formattedEndDate = endDate.ToString("dd MMMM yyyy, hh:mm tt", culture);
            string formattedAmount = amountPaid > 0 ? $"{amountPaid:N2} ج.م" : "مجاناً";

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
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
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
            padding: 30px;
        }}
        .welcome {{
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
        }}
        .details-box {{
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
        }}
        .details-row {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e9ecef;
        }}
        .details-row:last-child {{
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }}
        .details-label {{
            font-weight: 600;
            color: #6c757d;
            font-size: 15px;
        }}
        .details-value {{
            font-weight: 700;
            color: #2c3e50;
            font-size: 15px;
        }}
        .highlight {{
            color: #2575fc;
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
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 10px;
            text-align: center;
        }}
        @media only screen and (max-width: 600px) {{
            .container {{
                margin: 20px 10px;
                width: auto;
            }}
            .details-row {{
                flex-direction: column;
            }}
            .details-label {{
                margin-bottom: 5px;
            }}
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
            <div class=""welcome"">مرحباً {userName}،</div>
            <p style=""line-height: 1.6; color: #4a5568; margin-bottom: 25px;"">
                شكراً لاختيارك NexMedia AI. يسعدنا إخبارك بأنه تم تفعيل اشتراكك بنجاح. 
                يمكنك الآن الاستمتاع بكافة أدوات الذكاء الاصطناعي المتاحة في باقتك. إليك تفاصيل الاشتراك:
            </p>

            <div class=""details-box"">
                <div class=""details-row"">
                    <span class=""details-label"">الباقة الحالية:</span>
                    <span class=""details-value highlight"">{planName}</span>
                </div>
                <div class=""details-row"">
                    <span class=""details-label"">المبلغ المدفوع:</span>
                    <span class=""details-value"">{formattedAmount}</span>
                </div>
                <div class=""details-row"">
                    <span class=""details-label"">تاريخ البداية:</span>
                    <span class=""details-value"" dir=""ltr"">{formattedStartDate}</span>
                </div>
                <div class=""details-row"">
                    <span class=""details-label"">تاريخ الانتهاء:</span>
                    <span class=""details-value"" dir=""ltr"">{formattedEndDate}</span>
                </div>
                <div class=""details-row"">
                    <span class=""details-label"">الرصيد المتاح (الكريدتس):</span>
                    <span class=""details-value"">{monthlyCredits} نقطة</span>
                </div>
            </div>

            <p style=""line-height: 1.6; color: #4a5568;"">
                إذا كان لديك أي استفسار أو احتجت إلى مساعدة، فريق الدعم الفني لدينا جاهز لخدمتك في أي وقت.
            </p>

            <div style=""text-align: center; margin-top: 30px;"">
                <a href=""https://nexmedia.com/profile"" class=""btn"">انتقل إلى حسابك الآن</a>
            </div>
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
