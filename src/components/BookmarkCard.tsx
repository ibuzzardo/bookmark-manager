import { Bookmark } from '@/lib/types';
import { TagPill } from './TagPill';
import { ExternalLink, Calendar } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onTagSelect: (tagName: string) => void;
}

export function BookmarkCard({ bookmark, onTagSelect }: BookmarkCardProps): JSX.Element {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFaviconUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '/favicon.ico';
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50): string => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-foreground shadow-md rounded-lg p-4 flex flex-col space-y-2 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-3">
        <img
          src={bookmark.favicon || getFaviconUrl(bookmark.url)}
          alt=""
          className="w-6 h-6 mt-1 flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/favicon.ico';
          }}
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {bookmark.title}
          </h3>
          
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 text-xs flex items-center space-x-1 mb-2"
          >
            <span>{truncateUrl(bookmark.url)}</span>
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
          
          {bookmark.description && (
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
              {bookmark.description}
            </p>
          )}
          
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {bookmark.tags.map((tag) => (
                <TagPill
                  key={tag}
                  name={tag}
                  onClick={() => onTagSelect(tag)}
                />
              ))}
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Added {formatDate(bookmark.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}