import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { distanceInMeters } from '../lib/utils';
import type { AppUser, NearbyEncounter, Presence } from '../types';

const MAX_DISTANCE = 15;

export async function updatePresence(
  userId: string,
  latitude: number,
  longitude: number,
  visibilityEnabled: boolean
) {
  await setDoc(
    doc(db, 'presence', userId),
    {
      userId,
      latitude,
      longitude,
      visibilityEnabled,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export function subscribeToNearbyUsers(
  currentUserId: string,
  latitude: number,
  longitude: number,
  callback: (encounters: NearbyEncounter[]) => void
) {
  const q = query(collection(db, 'presence'), where('visibilityEnabled', '==', true));

  return onSnapshot(q, async (snapshot) => {
    const encounters: NearbyEncounter[] = [];

    for (const item of snapshot.docs) {
      const data = item.data() as Presence;
      if (data.userId === currentUserId) continue;
      if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') continue;

      const distanceMeters = distanceInMeters(
        latitude,
        longitude,
        data.latitude,
        data.longitude
      );

const rawUpdatedAt = data.updatedAt as
  | number
  | { toMillis?: () => number }
  | undefined;

const updatedAtMs =
  typeof rawUpdatedAt === 'number'
    ? rawUpdatedAt
    : rawUpdatedAt?.toMillis?.() ?? 0;

const isFresh = updatedAtMs > 0 && Date.now() - updatedAtMs < 15000;
if (distanceMeters <= MAX_DISTANCE && isFresh) {
        const userSnap = await getDoc(doc(db, 'users', data.userId));
        const otherUser = userSnap.exists()
          ? ({ id: userSnap.id, ...(userSnap.data() as Omit<AppUser, 'id'>) })
          : null;

        encounters.push({
          id: data.userId,
          otherUserId: data.userId,
          displayName: otherUser?.displayName || `User ${data.userId.slice(0, 5)}`,
          distanceMeters,
          firstSeenAt: Date.now(),
          lastSeenAt: Date.now(),
          status: 'none'
        });
      }
    }

    callback(encounters.sort((a, b) => a.distanceMeters - b.distanceMeters));
  });
}