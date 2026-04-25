import { getAuth } from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    where
} from 'firebase/firestore';
import app from '../firebase/config';

const db = getFirestore(app);
const auth = getAuth(app);

// CREATE OR GET CONVERSATION BETWEEN TWO USERS
export const getOrCreateConversation = async (otherUserId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const conversationId = [currentUser.uid, otherUserId].sort().join('_');
    const conversationRef = doc(db, 'conversations', conversationId);
    
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
      // Create new conversation
      await setDoc(conversationRef, {
        participants: [currentUser.uid, otherUserId],
        createdAt: new Date().toISOString(),
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
      });
    }
    
    return conversationId;
  } catch (error) {
    console.error('Error creating/getting conversation:', error);
    throw error;
  }
};

// SEND MESSAGE
export const sendMessage = async (conversationId, message, recipientId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
    
    const messageData = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'User',
      senderEmail: currentUser.email,
      text: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    await addDoc(messagesCollection, messageData);

    // Update last message in conversation
    const conversationRef = doc(db, 'conversations', conversationId);
    await setDoc(conversationRef, {
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// GET MESSAGES FOR CONVERSATION
export const getMessages = async (conversationId) => {
  try {
    const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// LISTEN TO MESSAGES IN REAL-TIME
export const listenToMessages = (conversationId, callback) => {
  try {
    const messagesCollection = collection(db, 'conversations', conversationId, 'messages');
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error listening to messages:', error);
    throw error;
  }
};

// GET ALL CONVERSATIONS FOR USER
export const getUserConversations = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const conversationsCollection = collection(db, 'conversations');
    const conversationsQuery = query(
      conversationsCollection,
      where('participants', 'array-contains', currentUser.uid)
    );
    
    const snapshot = await getDocs(conversationsQuery);
    const conversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by last message time (most recent first)
    return conversations.sort((a, b) => 
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// GET USER DETAILS
export const getUserDetails = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};
