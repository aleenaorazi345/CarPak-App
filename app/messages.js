import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
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
    View,
} from 'react-native';
import {
    getOrCreateConversation,
    getUserDetails,
    listenToMessages,
    sendMessage,
} from '../services/messagingService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  header: {
    backgroundColor: '#F4B400',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerBackButton: {
    paddingRight: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },

  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  messageBubble: {
    marginVertical: 6,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '85%',
  },

  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#F4B400',
  },

  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a2540',
    borderLeftWidth: 3,
    borderLeftColor: '#F4B400',
  },

  messageText: {
    fontSize: 14,
  },

  sentText: {
    color: '#0f172a',
    fontWeight: '500',
  },

  receivedText: {
    color: '#fff',
  },

  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },

  sentTimestamp: {
    color: '#0f172a',
    opacity: 0.7,
  },

  receivedTimestamp: {
    color: '#999',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1a2540',
  },

  input: {
    flex: 1,
    backgroundColor: '#1a2540',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    marginRight: 8,
    maxHeight: 100,
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F4B400',
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
    fontSize: 16,
  },
});

export default function Messages({ route, navigation }) {
  const { sellerId, sellerName } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const flatListRef = useRef(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (conversationId) {
      const unsubscribe = listenToMessages(conversationId, (msgs) => {
        setMessages(msgs);
        // Auto scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      return () => unsubscribe();
    }
  }, [conversationId]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      if (!sellerId) {
        Alert.alert('Error', 'Seller ID is missing');
        navigation.goBack();
        return;
      }

      // Get or create conversation
      const convId = await getOrCreateConversation(sellerId);
      setConversationId(convId);

      // Get seller details
      const details = await getUserDetails(sellerId);
      setSellerDetails(details);
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to start conversation');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !conversationId) return;

    try {
      const messageText = newMessage;
      setNewMessage('');

      await sendMessage(conversationId, messageText, sellerId);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
      setNewMessage(messageText);
    }
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUserMessage = item.senderId === currentUser?.uid;

    return (
      <View style={[styles.messageBubble, isCurrentUserMessage ? styles.sentBubble : styles.receivedBubble]}>
        <Text style={[styles.messageText, isCurrentUserMessage ? styles.sentText : styles.receivedText]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, isCurrentUserMessage ? styles.sentTimestamp : styles.receivedTimestamp]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={styles.loadingText}>Loading Chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{sellerName || sellerDetails?.name || 'Chat'}</Text>
          <Text style={{ fontSize: 12, color: '#0f172a', opacity: 0.8 }}>
            {sellerDetails?.email || 'User'}
          </Text>
        </View>
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={60} color="#F4B400" />
          <Text style={styles.emptyText}>Start a conversation</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={newMessage.trim() === ''}
        >
          <Ionicons name="send" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
