'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Folder } from '@/lib/types';
import { store } from '@/lib/store';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookmarkAdded: () => void;
}

export function AddBookmarkModal({ isOpen, onClose, onBookmarkAdded }: AddBookmarkModalProps): JSX.Element {
  const [url, setUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [folderId, setFolderId] = useState<string>('uncategorized');
  const [tags, setTags] = useState<string>('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setFolders(store.getFolders());
    }
  }, [isOpen]);

  const fetchMetadata = async (url: string): Promise<void> => {
    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        if (data.data.title && !title) {
          setTitle(data.data.title);
        }
        if (data.data.description && !description) {
          setDescription(data.data.description);
        }
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      // Fallback: try to extract domain as title
      try {
        const domain = new URL(url).hostname;
        if (!title) {
          setTitle(domain);
        }
      } catch {
        // Ignore if URL is invalid
      }
    }
  };

  const handleUrlChange = (newUrl: string): void => {
    setUrl(newUrl);
    setError('');
    
    // Auto-fetch metadata when URL looks complete
    if (newUrl && newUrl.includes('.') && (newUrl.startsWith('http') || !newUrl.includes(' '))) {
      const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
      fetchMetadata(fullUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: fullUrl,
          title: title || fullUrl,
          description: description || undefined,
          folderId,
          tags: tagArray,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add bookmark');
      }

      // Reset form
      setUrl('');
      setTitle('');
      setDescription('');
      setFolderId('uncategorized');
      setTags('');
      
      onBookmarkAdded();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-foreground rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add Bookmark</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL *
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bookmark title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          
          <div>
            <label htmlFor="folder" className="block text-sm font-medium text-gray-700 mb-1">
              Folder
            </label>
            <select
              id="folder"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !url || !title}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}