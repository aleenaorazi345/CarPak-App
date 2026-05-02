import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import {
    collection,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {
    getOrCreateConversation,
    getSellerInfo,
    sendMessage,
} from '../services/messagingService';
import {
    requestNotificationPermissions,
    setupNotificationHandler,
    showMessageNotification,
} from '../services/notificationService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a2540',
    borderBottomWidth: 1,
    borderBottomColor: '#F4B400',
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  messageGroup: {
    marginVertical: 8,
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F4B400',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '80%',
    marginBottom: 4,
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a2540',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '80%',
    marginBottom: 4,
  },
  senderText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  receiverText: {
    fontSize: 14,
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  receiverTimestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#1a2540',
    borderTopWidth: 1,
    borderTopColor: '#F4B400',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#F4B400',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#F4B400',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default function Chat() {
  const router = useRouter();
  const { carId, carName, sellerId } = useLocalSearchParams();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);
  const flatListRef = useRef(null);
  const currentUserId = getAuth().currentUser?.uid;
  const unsubscribeRef = useRef(null);

  // Initialize chat and set up real-time listeners
  useEffect(() => {
    setupNotificationHandler();
    requestNotificationPermissions();

    const initializeChat = async () => {
      try {
        const convId = await getOrCreateConversation(
          sellerId,
          carId,
          carName
        );
        setConversationId(convId);

        // Get seller info
        const seller = await getSellerInfo(sellerId);
        setSellerInfo(seller);

        // Set up real-time listener for messages
        const db = getFirestore();
        const messagesRef = collection(
          db,
          'conversations',
          convId,
          'messages'
        );
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        unsubscribeRef.current = onSnapshot(q, (snapshot) => {
          const messagesList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messagesList);

          // Show notification for new messages from other user
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const messageData = change.doc.data();
              if (messageData.sender !== currentUserId) {
                // Show notification
                showMessageNotification(
                  seller.name || 'Seller',
                  convId
                );
              }
            }
          });
        });

        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        Alert.alert('Error', 'Failed to load chat');
        setLoading(false);
      }
    };

    if (carId && sellerId) {
      initializeChat();
    }

    // Cleanup listener on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [carId, sellerId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSending(true);
    try {
      await sendMessage(conversationId, messageText.trim(), sellerId);
      setMessageText('');
      // Messages will be updated automatically by the real-time listener
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#F4B400" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4B400" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </View>
    );
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#F4B400" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {sellerInfo?.name || 'Seller'}
          </Text>
          <Text style={styles.headerSubtitle}>{carName}</Text>
        </View>
      </View>

      {/* Messages */}
      {messages.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageGroup,
                item.sender === currentUserId && { alignItems: 'flex-end' },
              ]}
            >
              <View
                style={
                  item.sender === currentUserId
                    ? styles.senderMessage
                    : styles.receiverMessage
                }
              >
                <Text
                  style={
                    item.sender === currentUserId
                      ? styles.senderText
                      : styles.receiverText
                  }
                >
                  {item.content}
                </Text>
              </View>
              <Text
                style={
                  item.sender === currentUserId
                    ? styles.timestamp
                    : styles.receiverTimestamp
                }
              >
                {formatTime(item.timestamp)}
              </Text>
            </View>
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
          editable={!sending}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={sending || !messageText.trim()}
          activeOpacity={0.8}
        >
          {sending ? (
            <ActivityIndicator color="#0f172a" size={20} />
          ) : (
            <Ionicons name="send" size={18} color="#0f172a" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
