import { useEffect, useState } from 'react';
import Card from '../components/Card';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { Chat, Message } from '../types';
import { createDirectChat, sendMessage, subscribeToChats, subscribeToMessages } from '../services/chatService';

export default function ChatsPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsub = subscribeToChats((items) => {
      setChats(items);
      if (!selectedChatId && items[0]) setSelectedChatId(items[0].id);
    });
    return unsub;
  }, [selectedChatId]);

  useEffect(() => {
    if (!selectedChatId) return;
    return subscribeToMessages(selectedChatId, setMessages);
  }, [selectedChatId]);

  async function handleCreateDemoChat() {
    if (!user) return;
    const chatId = await createDirectChat([user.uid], 'My chat');
    setSelectedChatId(chatId);
  }

  async function handleSend(text: string) {
    if (!user || !selectedChatId) return;
    await sendMessage(selectedChatId, user.uid, user.displayName ?? 'User', text);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Card title="Chats" subtitle="Direct and group conversations">
        <div className="space-y-3">
          <button onClick={handleCreateDemoChat} className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white">
            Create chat
          </button>
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${selectedChatId === chat.id ? 'border-brand-300 bg-brand-50' : ''}`}
            >
              <div className="font-semibold text-slate-900">{chat.title}</div>
              <div className="text-sm text-slate-500">{chat.isGroup ? 'Group chat' : 'Direct chat'}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Conversation" subtitle="Real-time Firestore messages">
        {selectedChatId ? <ChatWindow messages={messages} onSend={handleSend} /> : <div className="text-sm text-slate-500">Pick a chat.</div>}
      </Card>
    </div>
  );
}
