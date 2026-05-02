import { getAuth } from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    serverTimestamp,
    where,
} from 'firebase/firestore';
import app from '../firebase/config';

const db = getFirestore(app);
const auth = getAuth(app);

// 💬 SEND MESSAGE
export const sendMessage = async (conversationId, content, receiverId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, {
      sender: user.uid,
      content,
      receiverId,
      timestamp: serverTimestamp(),
      read: false,
    });
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// 💬 GET OR CREATE CONVERSATION
export const getOrCreateConversation = async (sellerId, carId, carName) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Check if conversation already exists
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', user.uid)
    );
    const querySnapshot = await getDocs(q);

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      if (
        data.participants.includes(sellerId) &&
        data.carId === carId
      ) {
        return docSnap.id; // Existing conversation
      }
    }

    // Create new conversation
    const conversationData = {
      participants: [user.uid, sellerId],
      carId,
      carName,
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: null,
    };

    const docRef = await addDoc(conversationsRef, conversationData);
    return docRef.id;
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error;
  }
};

// 💬 GET MESSAGES
export const getMessages = async (conversationId) => {
  try {
    const messagesRef = collection(
      db,
      'conversations',
      conversationId,
      'messages'
    );
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// 💬 GET USER CONVERSATIONS
export const getUserConversations = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', user.uid)
    );
    const querySnapshot = await getDocs(q);

    const conversations = [];
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      // Get the other participant's info
      const otherUserId = data.participants.find(
        pid => pid !== user.uid
      );
      
      if (otherUserId) {
        const userRef = doc(db, 'users', otherUserId);
        const userSnap = await getDoc(userRef);
        const otherUserData = userSnap.data() || {};

        conversations.push({
          id: docSnap.id,
          ...data,
          otherUserId,
          otherUserName: otherUserData.name || 'Unknown',
          otherUserPhone: otherUserData.phone || 'Not provided',
        });
      }
    }

    return conversations.sort((a, b) => {
      if (!a.lastMessageTime || !b.lastMessageTime) return 0;
      return b.lastMessageTime - a.lastMessageTime;
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// 💬 GET SELLER INFO
export const getSellerInfo = async (sellerId) => {
  try {
    const userRef = doc(db, 'users', sellerId);
    const userSnap = await getDoc(userRef);
    return userSnap.data() || {};
  } catch (error) {
    console.error('Error fetching seller info:', error);
    throw error;
  }
};
