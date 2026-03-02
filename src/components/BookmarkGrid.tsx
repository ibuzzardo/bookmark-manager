import { Bookmark } from '@/lib/types';
import { BookmarkCard } from './BookmarkCard';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onTagSelect: (tagName: string) => void;
}

export function BookmarkGrid({ bookmarks, onTagSelect }: BookmarkGridProps): JSX.Element {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">📚</div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No bookmarks found</h3>
        <p className="text-gray-500 text-sm">Add your first bookmark to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onTagSelect={onTagSelect}
        />
      ))}
    </div>
  );
}