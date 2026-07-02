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
            color: #0f62fe;
        }}
        .footer {{
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
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
            <div style=""text-align: center; margin-top: 30px;"">
                <a href=""https://nexmedia.com/pricing"" class=""btn"">تجديد الاشتراك الآن</a>
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
            <div style=""text-align: center; margin-top: 30px;"">
                <a href=""https://nexmedia.com/pricing"" class=""btn"">اشترك الآن لتفعيل حسابك</a>
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
