import * as Notifications from 'expo-notifications';
import { getAuth } from 'firebase/auth';
import {
    collection,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    where,
} from 'firebase/firestore';

let notificationSubscriptions = [];

// 🔔 REQUEST NOTIFICATION PERMISSIONS
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// 🔔 SET UP NOTIFICATION HANDLER
export const setupNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

// 🔔 LISTEN FOR INCOMING MESSAGES
export const listenForMessages = (conversationIds) => {
  // Clean up previous subscriptions
  notificationSubscriptions.forEach(unsubscribe => unsubscribe());
  notificationSubscriptions = [];

  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;
  const db = getFirestore();

  if (!currentUserId) return;

  // Listen to each conversation for new messages
  conversationIds.forEach(conversationId => {
    const messagesRef = collection(
      db,
      'conversations',
      conversationId,
      'messages'
    );
    const q = query(
      messagesRef,
      where('sender', '!=', currentUserId),
      where('read', '==', false),
      orderBy('sender'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const messageData = change.doc.data();
          
          // Get sender info
          const senderRef = doc(db, 'users', messageData.sender);
          const senderSnapshot = await getFirestore();
          
          try {
            // For real-time, we'll show a basic notification
            // In production, you'd fetch sender data here
            const senderId = messageData.sender;
            
            // Get conversation data for car name
            const convRef = doc(db, 'conversations', conversationId);
            // Show notification
            await Notifications.scheduleNotificationAsync({
              content: {
                title: '💬 New Message',
                body: `Someone messaged you`,
                data: {
                  conversationId,
                  senderId,
                },
              },
              trigger: null, // Show immediately
            });
          } catch (error) {
            console.error('Error sending notification:', error);
          }
        }
      });
    });

    notificationSubscriptions.push(unsubscribe);
  });
};

// 🔔 SHOW NOTIFICATION WITH SENDER NAME
export const showMessageNotification = async (senderName, conversationId) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💬 New Message',
        body: `${senderName} messaged you`,
        data: {
          conversationId,
          type: 'message',
        },
        sound: 'default',
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

// 🔔 CLEAN UP SUBSCRIPTIONS
export const cleanupMessageListeners = () => {
  notificationSubscriptions.forEach(unsubscribe => unsubscribe());
  notificationSubscriptions = [];
};

// 🔔 HANDLE NOTIFICATION RESPONSE
export const handleNotificationResponse = (callback) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const { conversationId } = response.notification.request.content.data;
      if (conversationId) {
        callback(conversationId);
      }
    }
  );

  return subscription;
};
