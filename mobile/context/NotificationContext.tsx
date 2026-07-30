import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from './AuthContext';
import Toast from 'react-native-root-toast';

type NotificationContextType = {
  isConnected: boolean;
};

const NotificationContext = createContext<NotificationContextType>({ isConnected: false });

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let activeConnection = connection;

    if (!user) {
      if (activeConnection) {
        activeConnection.stop();
        setConnection(null);
        setIsConnected(false);
      }
      return;
    }

    const connectSignalR = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://167.71.66.188:8080/hubs/notification', {
          accessTokenFactory: () => token || '',
        })
        .withAutomaticReconnect()
        .build();

      newConnection.on('ReceiveNotification', (title: string, message: string) => {
        // Show in-app toast notification
        Toast.show(`${title}\n${message}`, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP + 40,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: '#9b51e0',
          textColor: '#ffffff',
          opacity: 1,
        });
      });

      try {
        await newConnection.start();
        setIsConnected(true);
        setConnection(newConnection);
        activeConnection = newConnection;
      } catch (err) {
        console.error('SignalR Connection Error: ', err);
      }
    };

    connectSignalR();

    return () => {
      if (activeConnection) {
        activeConnection.stop();
      }
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
}
