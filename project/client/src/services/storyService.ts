import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Story } from '../types';

type CreateStoryInput = {
  file: File;
  ownerId: string;
  ownerName: string;
  caption: string;
  mediaType: 'image' | 'video';
};

export function subscribeToActiveStories(callback: (stories: Story[]) => void) {
  const now = Date.now();

  const q = query(
    collection(db, 'stories'),
    where('expiresAt', '>', now),
    orderBy('expiresAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const stories = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    })) as Story[];

    callback(stories);
  });
}

export async function markStoryAsViewed(storyId: string, userId: string) {
  await updateDoc(doc(db, 'stories', storyId), {
    viewedBy: arrayUnion(userId),
  });
}

export async function createStory({
  file,
  ownerId,
  ownerName,
  caption,
  mediaType,
}: CreateStoryInput) {
  const createdAt = Date.now();
  const expiresAt = createdAt + 24 * 60 * 60 * 1000;

  const storageRef = ref(storage, `stories/${ownerId}/${createdAt}-${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, 'stories'), {
    ownerId,
    ownerName,
    caption,
    imageUrl,
    createdAt,
    expiresAt,
    viewedBy: [],
    mediaType,
  });
}