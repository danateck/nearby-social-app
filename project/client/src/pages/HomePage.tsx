import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { subscribeToActiveStories } from '../services/storyService';
import { Story } from '../types';

export default function HomePage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const unsub = subscribeToActiveStories(setStories);
    return unsub;
  }, []);

  return (
    <div className="space-y-6">
      <Card title={`Hi ${user?.displayName ?? 'there'}`} subtitle="Your social dashboard">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-brand-50 p-4">
            <div className="text-sm text-brand-700">Nearby logic</div>
            <div className="mt-2 text-slate-800">Opt-in location presence up to 15 meters.</div>
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

      <Card title="Recent stories" subtitle="Stories disappear after 24 hours">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((story) => (
            <div key={story.id} className="overflow-hidden rounded-2xl border">
              <img src={story.imageUrl} alt={story.caption} className="h-48 w-full object-cover" />
              <div className="p-4">
                <div className="font-semibold">{story.ownerName}</div>
                <div className="mt-1 text-sm text-slate-600">{story.caption}</div>
              </div>
            </div>
          ))}
          {!stories.length ? <div className="text-sm text-slate-500">No stories uploaded yet.</div> : null}
        </div>
      </Card>
    </div>
  );
}
