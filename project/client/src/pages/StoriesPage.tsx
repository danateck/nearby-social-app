import { useEffect, useState } from 'react';
import Card from '../components/Card';
import StoryUploader from '../components/StoryUploader';
import { useAuth } from '../context/AuthContext';
import { subscribeToActiveStories, uploadStory } from '../services/storyService';
import { Story } from '../types';

export default function StoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const unsub = subscribeToActiveStories(setStories);
    return unsub;
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card title="Upload story" subtitle="Images expire after 24 hours">
        <StoryUploader onSubmit={(file, caption) => uploadStory(user.uid, user.displayName ?? 'User', file, caption)} />
      </Card>

      <Card title="Live stories" subtitle="Currently active">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((story) => (
            <div key={story.id} className="overflow-hidden rounded-2xl border">
              <img src={story.imageUrl} alt={story.caption} className="h-56 w-full object-cover" />
              <div className="p-4">
                <div className="font-semibold">{story.ownerName}</div>
                <div className="mt-1 text-sm text-slate-500">{story.caption}</div>
              </div>
            </div>
          ))}
          {!stories.length ? <div className="text-sm text-slate-500">No active stories.</div> : null}
        </div>
      </Card>
    </div>
  );
}
