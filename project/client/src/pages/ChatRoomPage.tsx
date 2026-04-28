import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';
import { sendMessage, subscribeToMessages } from '../services/chatService';

export default function ChatRoomPage() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!chatId) return;
    return subscribeToMessages(chatId, setMessages);
  }, [chatId]);

  async function handleSend(text: string) {
    if (!user || !chatId) return;

    await sendMessage(
      chatId,
      user.uid,
      user.displayName ?? 'User',
      text
    );
  }

  return (
    <div className="space-y-4">
      <ChatWindow messages={messages} onSend={handleSend} />
    </div>
  );
}