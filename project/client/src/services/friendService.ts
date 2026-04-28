import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { FriendRequest } from '../types';
import { deleteDoc } from 'firebase/firestore';

export async function sendFriendRequest(fromUserId: string, fromUserName: string, toUserId: string) {
  await addDoc(collection(db, 'users', toUserId, 'friendRequests'), {
    fromUserId,
    toUserId,
    fromUserName,
    status: 'pending',
    createdAt: serverTimestamp()
  });
}

export function subscribeToIncomingRequests(userId: string, callback: (items: FriendRequest[]) => void) {
  const q = query(collection(db, 'users', userId, 'friendRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<FriendRequest, 'id'>) })));
  });
}

export async function approveFriendRequest(userId: string, requestId: string, fromUserId: string) {
  await updateDoc(doc(db, 'users', userId, 'friendRequests', requestId), { status: 'approved' });

  await setDoc(doc(db, 'users', userId, 'friends', fromUserId), {
    createdAt: serverTimestamp()
  });

  await setDoc(doc(db, 'users', fromUserId, 'friends', userId), {
    createdAt: serverTimestamp()
  });
}

export async function rejectFriendRequest(userId: string, requestId: string) {
  await updateDoc(doc(db, 'users', userId, 'friendRequests', requestId), { status: 'rejected' });
}

export async function getFriendIds(userId: string): Promise<string[]> {
  const result = await getDocs(query(collection(db, 'users', userId, 'friends')));
  return result.docs.map((item) => item.id);
}



export type FriendItem = {
  id: string;
  displayName: string;
  email?: string;
};

export function subscribeToFriends(
  userId: string,
  callback: (friends: FriendItem[]) => void
) {
  return onSnapshot(collection(db, 'users', userId, 'friends'), async (snapshot) => {
    const friends = await Promise.all(
      snapshot.docs.map(async (friendDoc) => {
        const friendId = friendDoc.id;
        const userSnap = await getDoc(doc(db, 'users', friendId));
        const data = userSnap.data();

        return {
          id: friendId,
          displayName: data?.displayName || data?.name || `User ${friendId.slice(0, 5)}`,
          email: data?.email,
        };
      })
    );

    callback(friends);
  });
}




export async function removeFriend(userId: string, friendId: string) {
  await deleteDoc(doc(db, 'users', userId, 'friends', friendId));
  await deleteDoc(doc(db, 'users', friendId, 'friends', userId));
}