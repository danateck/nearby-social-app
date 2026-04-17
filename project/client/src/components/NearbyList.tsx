import { NearbyEncounter } from '../types';

export default function NearbyList({
  items,
  onRequest
}: {
  items: NearbyEncounter[];
  onRequest: (userId: string) => Promise<void>;
}) {
  if (!items.length) {
    return <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">No one nearby right now.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-2xl border p-4">
          <div>
            <div className="font-semibold text-slate-900">{item.displayName}</div>
            <div className="text-sm text-slate-500">{item.distanceMeters} meters away</div>
          </div>
          <button
            onClick={() => onRequest(item.otherUserId)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Send request
          </button>
        </div>
      ))}
    </div>
  );
}
