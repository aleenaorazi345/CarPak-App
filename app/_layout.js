import { Stack } from 'expo-router';
import { useEffect } from 'react';
import {
    handleNotificationResponse,
    requestNotificationPermissions,
    setupNotificationHandler,
} from '../services/notificationService';

export default function RootLayout() {
  useEffect(() => {
    // Initialize notifications
    setupNotificationHandler();
    requestNotificationPermissions();

    // Handle notification taps
    const subscription = handleNotificationResponse((conversationId) => {
      // Navigate to chat screen when notification is tapped
      // This will be handled by the notification response listener
    });

    return () => {
      subscription && subscription.remove();
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
