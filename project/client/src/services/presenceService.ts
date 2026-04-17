import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { distanceInMeters } from '../lib/utils';
import type { NearbyEncounter, Presence } from '../types';

const MAX_DISTANCE = 15;

export async function updatePresence(userId: string, latitude: number, longitude: number, visibilityEnabled: boolean) {
  await setDoc(doc(db, 'presence', userId), {
    userId,
    latitude,
    longitude,
    visibilityEnabled,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export function subscribeToNearbyUsers(
  currentUserId: string,
  latitude: number,
  longitude: number,
  callback: (encounters: NearbyEncounter[]) => void
) {
  const q = query(collection(db, 'presence'), where('visibilityEnabled', '==', true));

  return onSnapshot(q, (snapshot) => {
    const encounters: NearbyEncounter[] = [];

    snapshot.docs.forEach((item) => {
      const data = item.data() as Presence;
      if (data.userId === currentUserId) return;
      const distanceMeters = distanceInMeters(latitude, longitude, data.latitude, data.longitude);
      if (distanceMeters <= MAX_DISTANCE) {
        encounters.push({
          id: data.userId,
          otherUserId: data.userId,
          displayName: `User ${data.userId.slice(0, 5)}`,
          distanceMeters,
          firstSeenAt: Date.now(),
          lastSeenAt: Date.now(),
          status: 'none'
        });
      }
    });

    callback(encounters.sort((a, b) => a.distanceMeters - b.distanceMeters));
  });
}
