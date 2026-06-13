using System.Collections.Generic;
using NexClone.Backend.Models.Legacy;

namespace NexClone.Backend.Models.ViewModels
{
    public class DashboardViewModel
    {
        public int TotalUsers { get; set; }
        public int ActiveSubscriptions { get; set; }
        public decimal TotalRevenue { get; set; }
        
        public List<SubscriptionsPayment> RecentActivity { get; set; } = new List<SubscriptionsPayment>();
        
        public List<string> ChartLabels { get; set; } = new List<string>();
        public List<decimal> ChartData { get; set; } = new List<decimal>();
    }
}
