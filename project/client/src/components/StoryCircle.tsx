type StoryCircleProps = {
  name: string;
  imageUrl?: string;
  mine?: boolean;
  viewed?: boolean;
  onClick?: () => void;
};

export default function StoryCircle({
  name,
  imageUrl,
  mine = false,
  viewed = false,
  onClick,
}: StoryCircleProps) {
  const initials = name.trim().slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onClick}
      className="flex min-w-[78px] flex-col items-center gap-2"
      type="button"
    >
      <div
        className={`rounded-full p-[3px] ${
          viewed
            ? 'bg-slate-300'
            : 'bg-gradient-to-tr from-pink-500 via-orange-400 to-purple-500'
        }`}
      >
        <div className="rounded-full bg-white p-[3px]">
          <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-200">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700">
                {initials}
              </div>
            )}

            {mine && (
              <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-bold text-white">
                +
              </div>
            )}
          </div>
        </div>
      </div>

      <span className="max-w-[72px] truncate text-xs text-slate-700">
        {mine ? 'Your story' : name}
      </span>
    </button>
  );
}