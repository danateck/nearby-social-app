import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Story } from '../types';

export async function uploadStory(userId: string, ownerName: string, file: File, caption: string) {
  const path = `stories/${userId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'stories'), {
    ownerId: userId,
    ownerName,
    imageUrl,
    caption,
    createdAt: serverTimestamp(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  });
}

export function subscribeToActiveStories(callback: (stories: Story[]) => void) {
  const q = query(collection(db, 'stories'), where('expiresAt', '>', Date.now()), orderBy('expiresAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<Story, 'id'>) })));
  });
}
