import { FriendRequest } from '../types';

export default function RequestList({
  items,
  onApprove,
  onReject
}: {
  items: FriendRequest[];
  onApprove: (requestId: string, fromUserId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}) {
  if (!items.length) {
    return <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">No requests yet.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-2xl border p-4">
          <div>
            <div className="font-semibold text-slate-900">{item.fromUserName}</div>
            <div className="text-sm text-slate-500">Status: {item.status}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onReject(item.id)} className="rounded-xl border px-4 py-2 text-sm">
              Reject
            </button>
            <button onClick={() => onApprove(item.id, item.fromUserId)} className="rounded-xl bg-brand-600 px-4 py-2 text-sm text-white">
              Approve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
