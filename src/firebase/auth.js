import { auth, db } from './firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function signUp({ fullName, email, password, phone }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  if (fullName) {
    await updateProfile(user, { displayName: fullName });
  }

  const userDoc = doc(db, 'users', user.uid);
  await setDoc(userDoc, {
    fullName,
    email,
    phone,
    uid: user.uid,
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function getUserProfile(uid) {
  const userDoc = doc(db, 'users', uid);
  const snapshot = await getDoc(userDoc);
  return snapshot.exists() ? snapshot.data() : null;
}
