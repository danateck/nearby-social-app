import { useEffect, useState } from 'react';
import Card from '../components/Card';
import StoriesBar from '../components/StoriesBar';
import StoryViewer from '../components/StoryViewer';
import StoryCameraModal from '../components/StoryCameraModal';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToActiveStories,
  markStoryAsViewed,
  createStory,
} from '../services/storyService';
import {
  subscribeToFriends,
  removeFriend,
  type FriendItem,
} from '../services/friendService';
import type { Story } from '../types';

export default function HomePage() {
  const { user } = useAuth();

  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    const unsub = subscribeToActiveStories(setStories);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    return subscribeToFriends(user.uid, setFriends);
  }, [user]);

  async function handleUploadStory(file: File, mediaType: 'image' | 'video') {
    if (!user) return;

    await createStory({
      file,
      ownerId: user.uid,
      ownerName: user.displayName || 'You',
      caption: '',
      mediaType,
    });
  }

  async function handleRemoveFriend(friendId: string) {
    if (!user) return;
    await removeFriend(user.uid, friendId);
  }

  return (
    <div className="space-y-6">
      <StoriesBar
        currentUserId={user?.uid || ''}
        currentUserName={user?.displayName || 'You'}
        stories={stories}
        onOpenStory={async (story) => {
          setSelectedStory(story);

          if (user?.uid && story.ownerId !== user.uid) {
            await markStoryAsViewed(story.id, user.uid);
          }
        }}
        onCreateStory={() => setCameraOpen(true)}
      />

      <StoryCameraModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onUpload={handleUploadStory}
      />

      <Card title={`Hi ${user?.displayName ?? 'there'}`} subtitle="Your social dashboard">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-brand-50 p-4">
            <div className="text-sm text-brand-700">Nearby logic</div>
            <div className="mt-2 text-slate-800">
              Opt-in location presence up to 15 meters.
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-sm text-slate-600">Stories</div>
            <div className="mt-2 text-slate-800">
              {stories.length} active story items
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFriends(true)}
            className="rounded-2xl bg-slate-100 p-4 text-left transition hover:bg-slate-200"
          >
            <div className="text-sm text-slate-600">Friends</div>
            <div className="mt-2 text-slate-800 underline">
              {friends.length} friends
            </div>
          </button>

          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-sm text-slate-600">Reset</div>
            <div className="mt-2 text-slate-800">
              Nearby encounters expire every 24h
            </div>
          </div>
        </div>
      </Card>

      {showFriends && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Your friends</h2>

            {friends.length === 0 ? (
              <div className="text-sm text-slate-500">No friends yet</div>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {friend.displayName}
                    </div>
                    {friend.email && (
                      <div className="text-xs text-slate-500">{friend.email}</div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowFriends(false)}
              className="mt-4 w-full rounded-xl bg-slate-200 py-2 text-sm font-medium hover:bg-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <StoryViewer
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </div>
  );
}