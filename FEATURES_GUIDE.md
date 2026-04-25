# Features Implementation Guide

## Overview
This guide explains how the Favorites and Chat/Messaging features work together in your CarPak app.

---

## 1. FAVORITES FEATURE

### How It Works:
- Users browse cars in the **Search** tab
- When they find a car they like, they click the **❤️ heart icon**
- The car is saved to their Firestore database under `users/{userId}/favorites`
- They can view all saved cars in the **Favorites** tab
- From Favorites, they can remove cars or contact the seller

### File Structure:
```
services/
  ├── favoritesService.js      # Core favorites logic
  
app/(tabs)/
  ├── search.js                # Browse & add cars to favorites
  ├── favorites.js             # View saved favorite cars
```

### Firestore Structure:
```
users/
  └── {userId}/
      └── favorites/
          └── {carId}/
              ├── carId: string
              ├── name: string
              ├── price: number
              ├── image: string
              ├── year: number
              ├── mileage: number
              ├── transmission: string
              ├── sellerId: string
              ├── addedAt: timestamp
              └── ... (other car details)
```

### Functions Available:
```javascript
// Add car to favorites
await addToFavorites(carId, carData)

// Remove car from favorites
await removeFromFavorites(carId)

// Get all user's favorites
const favorites = await getUserFavorites()

// Check if car is favorited
const isFav = await isFavorited(carId)
```

---

## 2. MESSAGING/CHAT FEATURE

### How It Works:
- Users can contact sellers from **Search** tab or **Favorites** tab
- Clicking "Contact" or the chat icon opens the **Messages** screen
- They can send/receive real-time messages with the seller
- The conversation is saved in Firestore for future reference

### File Structure:
```
services/
  ├── messagingService.js      # Core messaging logic
  
app/
  ├── messages.js              # Chat interface
```

### Firestore Structure:
```
conversations/
  └── {conversationId}/ (format: "userId1_userId2" sorted)
      ├── participants: [userId1, userId2]
      ├── createdAt: timestamp
      ├── lastMessage: string
      ├── lastMessageTime: timestamp
      └── messages/
          └── {messageId}/
              ├── senderId: string
              ├── senderName: string
              ├── senderEmail: string
              ├── text: string
              ├── timestamp: timestamp
              └── read: boolean
```

### Functions Available:
```javascript
// Get or create a conversation
const conversationId = await getOrCreateConversation(otherUserId)

// Send a message
await sendMessage(conversationId, message, recipientId)

// Get all messages in conversation
const messages = await getMessages(conversationId)

// Listen to real-time messages
const unsubscribe = listenToMessages(conversationId, (messages) => {
  // Handle incoming messages
})

// Get all user's conversations
const conversations = await getUserConversations()

// Get user details
const userDetails = await getUserDetails(userId)
```

---

## 3. HOW FEATURES INTEGRATE

### Step-by-Step User Flow:

#### Scenario 1: Adding to Favorites
1. User goes to **Search** tab
2. Sees list of cars from Firestore (`cars` collection)
3. Clicks ❤️ heart icon on a car
4. `addToFavorites()` is called, saving car to `users/{userId}/favorites/{carId}`
5. Heart icon becomes filled/red
6. Car persists in Favorites tab

#### Scenario 2: Messaging from Favorites
1. User goes to **Favorites** tab
2. Sees their saved cars
3. Clicks "Contact" button
4. `getOrCreateConversation(sellerId)` creates/retrieves conversation
5. Navigates to **Messages** screen
6. User can type and send messages
7. Messages appear in real-time using `listenToMessages()`

#### Scenario 3: Messaging from Search
1. User browses cars in **Search** tab
2. Finds a car they're interested in
3. Clicks chat icon (without favoriting)
4. `getOrCreateConversation(sellerId)` creates/retrieves conversation
5. Opens **Messages** screen
6. Chat begins immediately

---

## 4. REQUIRED FIRESTORE RULES

Add these rules to your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow users to access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Favorites subcollection
      match /favorites/{favorite} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid in resource.data.participants;
      
      // Messages subcollection
      match /messages/{message} {
        allow read, write: if request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
      }
    }
    
    // Cars collection (public read)
    match /cars/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null; // Only authenticated users can add cars
    }
  }
}
```

---

## 5. HOW TO USE IN YOUR APP

### In search.js - Add to Favorites:
```javascript
const handleToggleFavorite = async (car) => {
  if (favorites.has(car.id)) {
    await removeFromFavorites(car.id);
  } else {
    await addToFavorites(car.id, car);
  }
};
```

### In search.js or favorites.js - Open Chat:
```javascript
const handleContact = (sellerId, carName) => {
  navigation.navigate('Messages', {
    sellerId: sellerId,
    sellerName: carName,
  });
};
```

### In messages.js - Send Messages:
```javascript
const handleSendMessage = async () => {
  await sendMessage(conversationId, newMessage, sellerId);
  setNewMessage('');
};
```

---

## 6. INTEGRATION WITH NAVIGATION

Update your router/navigation to include the Messages screen:

```javascript
// In your _layout.js or navigation file
import Messages from './messages';

// Add to your routes:
<Stack.Screen name="Messages" component={Messages} />
```

---

## 7. DATA THAT NEEDS TO BE IN CAR DOCUMENTS

When creating/uploading cars to Firestore, include:

```javascript
{
  name: "Honda Civic 2020",
  price: "2500000",
  year: 2020,
  mileage: 45000,
  transmission: "Automatic",
  image: "https://...", // Image URL
  description: "Like new condition",
  sellerId: "userId123",  // IMPORTANT: ID of the seller
  // ... other details
}
```

---

## 8. COMING SOON - FULL INTEGRATION

### When you want to enable adding cars from user dashboard:
- Create car upload screen
- Include `sellerId: currentUser.uid` when saving cars
- Cars appear in Search automatically

### When you want user to see their own cars:
- Create "My Cars" section in profile
- Query `cars` collection where `sellerId == currentUser.uid`

---

## 9. TESTING THE FEATURES

### Test Favorites:
1. Go to Search → Click heart on any car
2. Go to Favorites → Should see the car
3. Click "Remove" → Car disappears from Favorites

### Test Chat:
1. Go to Search/Favorites → Click "Contact"
2. Type a message → Send
3. Message should appear on screen
4. Real-time updates should work instantly

---

## 10. TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Favorites not saving | Check Firestore rules, ensure user is authenticated |
| Messages not appearing | Verify conversation ID is correct, check Firestore rules |
| Can't send message | Check internet connection, verify seller exists |
| Chat screen crashes | Ensure sellerId is passed in route params |
| No cars in search | Verify cars exist in `cars` collection, check Firestore rules |

---

## Summary

✅ **Favorites System**: Add/remove cars, view all favorites in one place
✅ **Chat System**: Real-time messaging between buyers and sellers
✅ **Integration**: Both features work seamlessly in the Search and Favorites tabs
✅ **Firestore Backed**: All data persists in your database
✅ **Real-time Updates**: Messages update instantly using listeners
