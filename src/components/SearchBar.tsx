'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { TagPill } from './TagPill';
import { store } from '@/lib/store';
import { Tag } from '@/lib/types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onTagSelect: (tagName: string | undefined) => void;
  selectedTag?: string;
}

export function SearchBar({ value, onChange, onTagSelect, selectedTag }: SearchBarProps): JSX.Element {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(store.getTags());
  }, []);

  const handleClearSearch = (): void => {
    onChange('');
    onTagSelect(undefined);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        {(value || selectedTag) && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2 py-1">Filter by tag:</span>
          {tags.map((tag) => (
            <TagPill
              key={tag.id}
              name={tag.name}
              color={tag.color}
              selected={selectedTag === tag.name}
              onClick={() => onTagSelect(selectedTag === tag.name ? undefined : tag.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}