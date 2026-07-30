import * as signalR from "@microsoft/signalr";

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private onNotificationReceivedCallback: ((title: string, message: string, type: string, url: string) => void) | null = null;

    public startConnection() {
        if (this.connection) return;

        // Assuming NEXT_PUBLIC_API_URL has the backend URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${backendUrl}/hubs/notification`, {
                // Ensure cookies are sent for Auth
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        this.connection.start()
            .then(() => console.log('SignalR Notification Hub connected'))
            .catch(err => console.error('SignalR Connection Error: ', err));

        this.connection.on("ReceiveNotification", (title, message, type, url) => {
            if (this.onNotificationReceivedCallback) {
                this.onNotificationReceivedCallback(title, message, type, url);
            }
        });
    }

    public onNotification(callback: (title: string, message: string, type: string, url: string) => void) {
        this.onNotificationReceivedCallback = callback;
    }

    public stopConnection() {
        if (this.connection) {
            this.connection.stop();
            this.connection = null;
        }
    }
}

export const signalRNotificationService = new SignalRService();
