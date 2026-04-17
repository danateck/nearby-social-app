import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Chat, Message } from '../types';

export async function createDirectChat(memberIds: string[], title: string) {
  const chatRef = await addDoc(collection(db, 'chats'), {
    title,
    isGroup: false,
    updatedAt: serverTimestamp()
  });

  await Promise.all(memberIds.map((memberId) => setDoc(doc(db, 'chats', chatRef.id, 'members', memberId), { joinedAt: serverTimestamp() })));
  return chatRef.id;
}

export async function createGroupChat(title: string, memberIds: string[]) {
  const chatRef = await addDoc(collection(db, 'chats'), {
    title,
    isGroup: true,
    updatedAt: serverTimestamp()
  });

  await Promise.all(memberIds.map((memberId) => setDoc(doc(db, 'chats', chatRef.id, 'members', memberId), { joinedAt: serverTimestamp() })));
  return chatRef.id;
}

export function subscribeToChats(callback: (chats: Chat[]) => void) {
  const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<Chat, 'id'>) })));
  });
}

export function subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs
        .map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<Message, 'id'>) }))
        .filter((message) => message.chatId === chatId)
    );
  });
}

export async function sendMessage(chatId: string, senderId: string, senderName: string, text: string) {
  await addDoc(collection(db, 'messages'), {
    chatId,
    senderId,
    senderName,
    text,
    createdAt: serverTimestamp()
  });

  await updateDoc(doc(db, 'chats', chatId), { updatedAt: serverTimestamp() });
}
