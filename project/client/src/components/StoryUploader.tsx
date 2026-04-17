import { FormEvent, useState } from 'react';

export default function StoryUploader({ onSubmit }: { onSubmit: (file: File, caption: string) => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      await onSubmit(file, caption);
      setCaption('');
      setFile(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
      <input
        className="w-full rounded-2xl border px-4 py-3"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button className="rounded-2xl bg-slate-900 px-4 py-3 text-white" disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Upload story'}
      </button>
    </form>
  );
}
