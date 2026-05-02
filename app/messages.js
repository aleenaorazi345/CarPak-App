import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getUserConversations } from '../services/messagingService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1a2540',
    borderBottomWidth: 1,
    borderBottomColor: '#F4B400',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
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
    paddingHorizontal: 30,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  conversationItem: {
    backgroundColor: '#1a2540',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F4B400',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  conversationCar: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  conversationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 12,
    color: '#ccc',
    flex: 1,
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
    marginLeft: 8,
  },
  conversationPhone: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
});

export default function Messages() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      setLoading(true);
      const convs = await getUserConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
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
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4B400" />
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#F4B400" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => {
                router.push({
                  pathname: '/chat',
                  params: {
                    carId: item.carId,
                    carName: item.carName,
                    sellerId: item.otherUserId,
                  },
                });
              }}
            >
              <Text style={styles.conversationName}>{item.otherUserName}</Text>
              <Text style={styles.conversationCar}>Car: {item.carName}</Text>
              <Text style={styles.conversationPhone}>
                📱 {item.otherUserPhone}
              </Text>
              <View style={styles.conversationMeta}>
                <Text
                  style={styles.lastMessage}
                  numberOfLines={1}
                >
                  {item.lastMessage || 'No messages yet'}
                </Text>
                {item.lastMessageTime && (
                  <Text style={styles.timestamp}>
                    {new Date(item.lastMessageTime).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-outline" size={48} color="#666" />
          <Text style={styles.emptyText}>
            No conversations yet. Start chatting with sellers!
          </Text>
        </View>
      )}
    </View>
  );
}
