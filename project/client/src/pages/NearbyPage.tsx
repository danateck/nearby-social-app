import { useEffect, useState } from 'react';
import Card from '../components/Card';
import NearbyList from '../components/NearbyList';
import { useAuth } from '../context/AuthContext';
import { updateVisibility } from '../services/userService';
import { subscribeToNearbyUsers, updatePresence } from '../services/presenceService';
import { sendFriendRequest } from '../services/friendService';
import { NearbyEncounter } from '../types';

export default function NearbyPage() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [nearby, setNearby] = useState<NearbyEncounter[]>([]);

  useEffect(() => {
    if (!user || !enabled) return;

    const watcher = navigator.geolocation.watchPosition(async (pos) => {
      setPosition(pos);
      await updatePresence(user.uid, pos.coords.latitude, pos.coords.longitude, true);
    });

    return () => navigator.geolocation.clearWatch(watcher);
  }, [user, enabled]);

  useEffect(() => {
    if (!user || !position || !enabled) return;
    return subscribeToNearbyUsers(user.uid, position.coords.latitude, position.coords.longitude, setNearby);
  }, [user, position, enabled]);

  async function toggleVisibility() {
    if (!user) return;
    const next = !enabled;
    setEnabled(next);
    await updateVisibility(user.uid, next);
    if (!next && position) {
      await updatePresence(user.uid, position.coords.latitude, position.coords.longitude, false);
    }
  }

  async function handleRequest(otherUserId: string) {
    if (!user) return;
    await sendFriendRequest(user.uid, user.displayName ?? 'User', otherUserId);
  }

  return (
    <div className="space-y-6">
      <Card
        title="Nearby discovery"
        subtitle="Both users must install the app and enable visibility"
        right={
          <button onClick={toggleVisibility} className={`rounded-2xl px-4 py-2 text-sm font-medium ${enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
            {enabled ? 'Visibility on' : 'Visibility off'}
          </button>
        }
      >
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Browser web apps cannot silently detect all nearby phones. This page uses geolocation and shared presence to find people who also opted in.
        </div>
      </Card>

      <Card title="People around you" subtitle="Approximate real-time results under 15 meters">
        <NearbyList items={nearby} onRequest={handleRequest} />
      </Card>
    </div>
  );
}
