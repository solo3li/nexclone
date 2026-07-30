using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace NexClone.Backend.Hubs
{
    public class NotificationHub : Hub
    {
        // Clients will listen to events like "ReceiveNotification"
        public async Task SendNotification(string userId, string title, string message, string type, string url)
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", title, message, type, url);
        }
    }
}
