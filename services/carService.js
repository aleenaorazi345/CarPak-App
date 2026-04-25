import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../firebase/config';

const db = getFirestore(app);

// ADD CAR
export const addCar = async (car) => {
  return await addDoc(collection(db, 'cars'), car);
};

// GET CARS
export const getCars = async () => {
  const snapshot = await getDocs(collection(db, 'cars'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};