'use client';

import { useState, useEffect } from 'react';
import { Folder } from '@/lib/types';
import { store } from '@/lib/store';
import { Menu, X, Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  onFolderSelect: (folderId: string | undefined) => void;
  selectedFolderId?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ onFolderSelect, selectedFolderId, isOpen, onToggle }: SidebarProps): JSX.Element {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isAddingFolder, setIsAddingFolder] = useState<boolean>(false);

  useEffect(() => {
    setFolders(store.getFolders());
  }, []);

  const handleAddFolder = async (): Promise<void> => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });

      if (response.ok) {
        setFolders(store.getFolders());
        setNewFolderName('');
        setIsAddingFolder(false);
      }
    } catch (error) {
      console.error('Failed to add folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string): Promise<void> => {
    if (folderId === 'uncategorized') return;

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFolders(store.getFolders());
        if (selectedFolderId === folderId) {
          onFolderSelect(undefined);
        }
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-foreground shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <button
            onClick={() => onFolderSelect(undefined)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              !selectedFolderId 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Bookmarks
          </button>
          
          <div className="mt-4 space-y-1">
            {folders.map((folder) => (
              <div key={folder.id} className="flex items-center group">
                <button
                  onClick={() => onFolderSelect(folder.id)}
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFolderId === folder.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{folder.icon || '📁'}</span>
                  {folder.name}
                </button>
                
                {folder.id !== 'uncategorized' && (
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            {isAddingFolder ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddFolder();
                    if (e.key === 'Escape') {
                      setIsAddingFolder(false);
                      setNewFolderName('');
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddFolder}
                    className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingFolder(false);
                      setNewFolderName('');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingFolder(true)}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Folder
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-foreground shadow-lg rounded-md"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}