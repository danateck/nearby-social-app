import type { Story } from '../types';

type StoryViewerProps = {
  story: Story | null;
  onClose: () => void;
};

export default function StoryViewer({ story, onClose }: StoryViewerProps) {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-sm text-white"
          type="button"
        >
          ✕
        </button>

        <div className="p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold text-slate-800">
              {story.ownerName}
            </div>
            <div className="text-xs text-slate-500">
              {story.caption || 'Story'}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-slate-100">
            {story.mediaType === 'video' ? (
              <video
                src={story.imageUrl}
                controls
                autoPlay
                className="max-h-[70vh] w-full object-cover"
              />
            ) : (
              <img
                src={story.imageUrl}
                alt={story.ownerName}
                className="max-h-[70vh] w-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}