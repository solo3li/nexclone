using System;

namespace NexClone.Backend.Core.Interfaces
{
    public interface IEmailTemplateService
    {
        string GetSubscriptionReceiptEmail(
            string userName, 
            string planName, 
            DateTime startDate, 
            DateTime endDate, 
            decimal monthlyCredits, 
            decimal amountPaid = 0m,
            string invoiceUrl = "");

        string GetGracePeriodEmail(
            string userName, 
            string planName, 
            int gracePeriodDays);

        string GetSubscriptionExpiredEmail(
            string userName, 
            string planName);
    }
}
