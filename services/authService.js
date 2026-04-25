import {
    createUserWithEmailAndPassword,
    getAuth
} from 'firebase/auth';
import app from '../firebase/config';

import {
    doc,
    getFirestore,
    serverTimestamp,
    setDoc
} from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

// SIGN UP + STORE USER
export const registerUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  const user = userCredential.user;

  // 🔥 store extra data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    name: name,
    email: email,
    createdAt: serverTimestamp()
  });

  return user;
};

export default auth;