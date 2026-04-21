import StoryCircle from './StoryCircle';
import type { Story } from '../types';

type StoriesBarProps = {
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto?: string;
  stories: Story[];
  onOpenStory: (story: Story) => void;
  onCreateStory: () => void;
};

export default function StoriesBar({
  currentUserId,
  currentUserName,
  currentUserPhoto,
  stories,
  onOpenStory,
  onCreateStory,
}: StoriesBarProps) {
  const friendStories = stories.filter((story) => story.ownerId !== currentUserId);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Stories</h3>
      </div>

      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
        <StoryCircle
          name={currentUserName}
          imageUrl={currentUserPhoto}
          mine
          onClick={onCreateStory}
        />

        {friendStories.map((story) => {
          const viewed = story.viewedBy?.includes(currentUserId) ?? false;

          return (
            <StoryCircle
              key={story.id}
              name={story.ownerName}
              imageUrl={story.imageUrl}
              viewed={viewed}
              onClick={() => onOpenStory(story)}
            />
          );
        })}
      </div>
    </div>
  );
}