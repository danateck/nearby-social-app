import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Chat } from '../types';
import { subscribeToChats, createDirectChat } from '../services/chatService';
import { subscribeToFriends, type FriendItem } from '../services/friendService';

export default function ChatsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const unsub = subscribeToChats(setChats);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    return subscribeToFriends(user.uid, setFriends);
  }, [user]);

  async function handleStartChat(friend: FriendItem) {
    if (!user) return;

    const chatId = await createDirectChat(
      [user.uid, friend.id],
      friend.displayName
    );

    navigate(`/chats/${chatId}`);
  }

  return (
    <div className="space-y-4">
      <Card title="Chats" subtitle="Your conversations">
        <button
          onClick={() => setShowPicker(true)}
          className="w-full rounded-2xl bg-brand-600 py-3 text-white"
        >
          Start chat
        </button>

        <div className="mt-4 space-y-3">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate(`/chats/${chat.id}`)}
              className="w-full rounded-2xl border px-4 py-3 text-left"
            >
              <div className="font-semibold text-slate-900">
                {chat.title}
              </div>
              <div className="text-sm text-slate-500">
                {chat.isGroup ? 'Group chat' : 'Direct chat'}
              </div>
            </button>
          ))}

          {!chats.length && (
            <div className="text-sm text-slate-500">
              No chats yet
            </div>
          )}
        </div>
      </Card>

      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Select friend</h2>

            {friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => handleStartChat(friend)}
                className="w-full border-b py-3 text-left"
              >
                {friend.displayName}
              </button>
            ))}

            <button
              onClick={() => setShowPicker(false)}
              className="mt-4 w-full rounded-xl bg-slate-200 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}