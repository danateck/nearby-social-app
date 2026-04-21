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
import type { Story } from '../types';

export default function HomePage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToActiveStories(setStories);
    return unsub;
  }, []);

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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-brand-50 p-4">
            <div className="text-sm text-brand-700">Nearby logic</div>
            <div className="mt-2 text-slate-800">
              Opt-in location presence up to 15 meters.
            </div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-sm text-slate-600">Stories</div>
            <div className="mt-2 text-slate-800">{stories.length} active story items</div>
          </div>

          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="text-sm text-slate-600">Reset</div>
            <div className="mt-2 text-slate-800">Nearby encounters expire every 24h</div>
          </div>
        </div>
      </Card>

      <StoryViewer
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
      />
    </div>
  );
}