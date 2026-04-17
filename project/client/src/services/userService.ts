import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { AppUser } from '../types';

export function subscribeToUser(userId: string, callback: (user: AppUser | null) => void) {
  return onSnapshot(doc(db, 'users', userId), (snapshot) => {
    if (!snapshot.exists()) return callback(null);
    callback({ id: snapshot.id, ...(snapshot.data() as Omit<AppUser, 'id'>) });
  });
}

export async function updateVisibility(userId: string, enabled: boolean) {
  await updateDoc(doc(db, 'users', userId), {
    visibilityEnabled: enabled,
    lastActiveAt: serverTimestamp()
  });
}

export async function ensureUserDocument(userId: string, email: string, displayName: string) {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName,
      email,
      visibilityEnabled: false,
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp()
    });
  }
}
