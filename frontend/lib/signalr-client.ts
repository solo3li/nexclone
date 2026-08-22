import * as signalR from "@microsoft/signalr";

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private isStarting = false;
    private onNotificationReceivedCallback: ((title: string, message: string, type: string, url: string) => void) | null = null;
    private onWalletUpdateReceivedCallback: (() => void) | null = null;

    public async startConnection() {
        if (this.connection || this.isStarting) return;

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${backendUrl}/hubs/notification`, {
                withCredentials: true,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.connection.on("ReceiveNotification", (title, message, type, url) => {
            if (this.onNotificationReceivedCallback) {
                this.onNotificationReceivedCallback(title, message, type, url);
            }
        });

        this.connection.on("ReceiveWalletUpdate", () => {
            if (this.onWalletUpdateReceivedCallback) {
                this.onWalletUpdateReceivedCallback();
            }
        });

        this.isStarting = true;
        try {
            if (this.connection.state === signalR.HubConnectionState.Disconnected) {
                await this.connection.start();
                console.log('[SignalR] Notification Hub connected successfully');
            }
        } catch (err: any) {
            if (err?.name !== 'AbortError' && !err?.message?.includes('stopped during negotiation')) {
                console.warn('[SignalR] Connection notice:', err?.message || err);
            }
        } finally {
            this.isStarting = false;
        }
    }

    public onNotification(callback: (title: string, message: string, type: string, url: string) => void) {
        this.onNotificationReceivedCallback = callback;
    }

    public onWalletUpdate(callback: () => void) {
        this.onWalletUpdateReceivedCallback = callback;
    }

    public async stopConnection() {
        if (this.connection) {
            try {
                if (this.connection.state === signalR.HubConnectionState.Connected) {
                    await this.connection.stop();
                }
            } catch {
            } finally {
                this.connection = null;
                this.isStarting = false;
            }
        }
    }
}

export const signalRNotificationService = new SignalRService();