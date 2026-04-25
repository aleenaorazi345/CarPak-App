import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import app from '../firebase/config';

const db = getFirestore(app);
const auth = getAuth(app);

// ADD CAR TO FAVORITES
export const addToFavorites = async (carId, carData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const favoriteRef = doc(db, 'users', user.uid, 'favorites', carId);
    await setDoc(favoriteRef, {
      carId,
      ...carData,
      addedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// REMOVE FROM FAVORITES
export const removeFromFavorites = async (carId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const favoriteRef = doc(db, 'users', user.uid, 'favorites', carId);
    await deleteDoc(favoriteRef);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// GET ALL FAVORITES FOR USER
export const getUserFavorites = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const favoritesCollection = collection(db, 'users', user.uid, 'favorites');
    const snapshot = await getDocs(favoritesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// CHECK IF CAR IS FAVORITED
export const isFavorited = async (carId) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const favoriteRef = doc(db, 'users', user.uid, 'favorites', carId);
    const favoriteSnap = await getDoc(favoriteRef);
    return favoriteSnap.exists();
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};
