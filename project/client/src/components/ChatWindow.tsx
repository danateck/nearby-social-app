import { FormEvent, useState } from 'react';
import { Message } from '../types';
import { formatTime } from '../lib/utils';

export default function ChatWindow({ messages, onSend }: { messages: Message[]; onSend: (text: string) => Promise<void> }) {
  const [text, setText] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    await onSend(text.trim());
    setText('');
  }

  return (
    <div className="space-y-4">
      <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border p-4">
        {messages.map((message) => (
          <div key={message.id} className="rounded-2xl bg-slate-50 p-3">
            <div className="font-medium text-slate-900">{message.senderName}</div>
            <div className="mt-1 text-slate-700">{message.text}</div>
            <div className="mt-2 text-xs text-slate-400">{formatTime(message.createdAt)}</div>
          </div>
        ))}
        {!messages.length ? <div className="text-sm text-slate-500">No messages yet.</div> : null}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          className="flex-1 rounded-2xl border px-4 py-3"
          placeholder="Write a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="rounded-2xl bg-brand-600 px-5 py-3 font-medium text-white">Send</button>
      </form>
    </div>
  );
}
