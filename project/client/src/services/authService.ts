import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export async function registerUser(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  await setDoc(doc(db, 'users', credential.user.uid), {
    displayName,
    email,
    visibilityEnabled: false,
    createdAt: serverTimestamp(),
    lastActiveAt: serverTimestamp()
  });
}

export async function loginUser(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}
