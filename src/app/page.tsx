'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { BookmarkGrid } from '@/components/BookmarkGrid';
import { AddBookmarkModal } from '@/components/AddBookmarkModal';
import { Bookmark } from '@/lib/types';
import { store } from '@/lib/store';

export default function HomePage(): JSX.Element {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const allBookmarks = store.getBookmarks();
    setBookmarks(allBookmarks);
    setFilteredBookmarks(allBookmarks);
  }, []);

  useEffect(() => {
    const results = store.searchBookmarks(searchQuery, selectedFolderId, selectedTag);
    setFilteredBookmarks(results);
  }, [searchQuery, selectedFolderId, selectedTag, bookmarks]);

  const handleFolderSelect = (folderId: string | undefined): void => {
    setSelectedFolderId(folderId);
    setSelectedTag(undefined);
  };

  const handleTagSelect = (tagName: string | undefined): void => {
    setSelectedTag(tagName);
    setSelectedFolderId(undefined);
  };

  const handleBookmarkAdded = (): void => {
    const allBookmarks = store.getBookmarks();
    setBookmarks(allBookmarks);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        onFolderSelect={handleFolderSelect}
        selectedFolderId={selectedFolderId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors"
            >
              Add Bookmark
            </button>
          </div>
          
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            onTagSelect={handleTagSelect}
            selectedTag={selectedTag}
          />
          
          <BookmarkGrid 
            bookmarks={filteredBookmarks}
            onTagSelect={handleTagSelect}
          />
        </div>
      </main>

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookmarkAdded={handleBookmarkAdded}
      />
    </div>
  );
}