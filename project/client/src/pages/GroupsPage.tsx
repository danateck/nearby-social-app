import { FormEvent, useState } from 'react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { createGroupChat } from '../services/chatService';

export default function GroupsPage() {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!groupName.trim() || !user) return;
    await createGroupChat(groupName.trim(), [user.uid]);
    setStatus('Group created');
    setGroupName('');
  }

  return (
    <div className="space-y-6">
      <Card title="Create group" subtitle="Start a group chat with your approved friends">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
          <input
            className="flex-1 rounded-2xl border px-4 py-3"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-white">Create</button>
        </form>
        {status ? <div className="mt-3 text-sm text-emerald-600">{status}</div> : null}
      </Card>
    </div>
  );
}
