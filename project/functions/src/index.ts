import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';

admin.initializeApp();
const db = admin.firestore();

export const cleanupExpiredStories = onSchedule('every 1 hours', async () => {
  const now = Date.now();
  const snapshot = await db.collection('stories').where('expiresAt', '<=', now).get();

  const batch = db.batch();
  snapshot.docs.forEach((docItem) => batch.delete(docItem.ref));
  await batch.commit();
});

export const cleanupOldNearbyEncounters = onSchedule('every 24 hours', async () => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const users = await db.collection('users').get();

  for (const userDoc of users.docs) {
    const encounters = await userDoc.ref.collection('nearbyEncounters').where('lastSeenAt', '<=', cutoff).get();
    if (encounters.empty) continue;
    const batch = db.batch();
    encounters.docs.forEach((encounter) => batch.delete(encounter.ref));
    await batch.commit();
  }
});

export const syncEncounterFromPresence = onDocumentWritten('presence/{userId}', async (event) => {
  const after = event.data?.after?.data() as { userId: string; latitude: number; longitude: number; visibilityEnabled: boolean } | undefined;
  if (!after || !after.visibilityEnabled) return;

  const allPresence = await db.collection('presence').where('visibilityEnabled', '==', true).get();
  const now = Date.now();

  for (const docItem of allPresence.docs) {
    const other = docItem.data() as { userId: string; latitude: number; longitude: number; visibilityEnabled: boolean };
    if (other.userId === after.userId) continue;

    const distance = distanceInMeters(after.latitude, after.longitude, other.latitude, other.longitude);
    if (distance > 15) continue;

    const currentEncounterRef = db.collection('users').doc(after.userId).collection('nearbyEncounters').doc(other.userId);
    const otherEncounterRef = db.collection('users').doc(other.userId).collection('nearbyEncounters').doc(after.userId);

    await currentEncounterRef.set(
      {
        otherUserId: other.userId,
        displayName: `User ${other.userId.slice(0, 5)}`,
        distanceMeters: distance,
        firstSeenAt: now,
        lastSeenAt: now,
        status: 'none'
      },
      { merge: true }
    );

    await otherEncounterRef.set(
      {
        otherUserId: after.userId,
        displayName: `User ${after.userId.slice(0, 5)}`,
        distanceMeters: distance,
        firstSeenAt: now,
        lastSeenAt: now,
        status: 'none'
      },
      { merge: true }
    );
  }
});

function distanceInMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371e3;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return Math.round(R * y);
}
