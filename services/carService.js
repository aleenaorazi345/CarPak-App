import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from 'firebase/firestore';
import app from '../firebase/config';

const db = getFirestore(app);

// ADD car
export const addCar = async (car) => {
  return await addDoc(collection(db, 'cars'), car);
};

// GET CARS
export const getCars = async () => {
  const snapshot = await getDocs(collection(db, 'cars'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// DELETE CAR
export const deleteCar = async (carId) => {
  return await deleteDoc(doc(db, 'Cars', carId));
};