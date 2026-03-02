import { AppState, Bookmark, Folder, Tag } from './types';

const STORAGE_KEY = 'bookmark-manager-data';

const defaultState: AppState = {
  bookmarks: [],
  folders: [
    {
      id: 'uncategorized',
      name: 'Uncategorized',
      icon: '📁',
      createdAt: new Date().toISOString(),
    },
  ],
  tags: [],
};

class Store {
  private state: AppState = defaultState;
  private isClient = typeof window !== 'undefined';

  constructor() {
    if (this.isClient) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.state = { ...defaultState, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      this.state = defaultState;
    }
  }

  private saveToStorage(): void {
    if (!this.isClient) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      // Handle quota exceeded gracefully
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please clear some bookmarks.');
      }
    }
  }

  getState(): AppState {
    return this.state;
  }

  getBookmarks(): Bookmark[] {
    return this.state.bookmarks;
  }

  getBookmark(id: string): Bookmark | undefined {
    return this.state.bookmarks.find(b => b.id === id);
  }

  addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>): Bookmark {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.state.bookmarks.push(newBookmark);
    this.updateTags();
    this.saveToStorage();
    return newBookmark;
  }

  updateBookmark(id: string, updates: Partial<Bookmark>): Bookmark | null {
    const index = this.state.bookmarks.findIndex(b => b.id === id);
    if (index === -1) return null;

    this.state.bookmarks[index] = {
      ...this.state.bookmarks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.updateTags();
    this.saveToStorage();
    return this.state.bookmarks[index];
  }

  deleteBookmark(id: string): boolean {
    const index = this.state.bookmarks.findIndex(b => b.id === id);
    if (index === -1) return false;

    this.state.bookmarks.splice(index, 1);
    this.updateTags();
    this.saveToStorage();
    return true;
  }

  getFolders(): Folder[] {
    return this.state.folders;
  }

  getFolder(id: string): Folder | undefined {
    return this.state.folders.find(f => f.id === id);
  }

  addFolder(folder: Omit<Folder, 'id' | 'createdAt'>): Folder {
    const newFolder: Folder = {
      ...folder,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    this.state.folders.push(newFolder);
    this.saveToStorage();
    return newFolder;
  }

  deleteFolder(id: string): boolean {
    if (id === 'uncategorized') return false; // Cannot delete default folder
    
    const index = this.state.folders.findIndex(f => f.id === id);
    if (index === -1) return false;

    // Move bookmarks to uncategorized
    this.state.bookmarks.forEach(bookmark => {
      if (bookmark.folderId === id) {
        bookmark.folderId = 'uncategorized';
        bookmark.updatedAt = new Date().toISOString();
      }
    });

    this.state.folders.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  getTags(): Tag[] {
    return this.state.tags;
  }

  private updateTags(): void {
    const tagNames = new Set<string>();
    this.state.bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => tagNames.add(tag));
    });

    const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];
    
    this.state.tags = Array.from(tagNames).map((name, index) => ({
      id: crypto.randomUUID(),
      name,
      color: colors[index % colors.length],
    }));
  }

  searchBookmarks(query: string, folderId?: string, tagName?: string): Bookmark[] {
    let results = this.state.bookmarks;

    if (folderId) {
      results = results.filter(b => b.folderId === folderId);
    }

    if (tagName) {
      results = results.filter(b => b.tags.includes(tagName));
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(b => 
        b.title.toLowerCase().includes(lowerQuery) ||
        b.url.toLowerCase().includes(lowerQuery) ||
        (b.description && b.description.toLowerCase().includes(lowerQuery)) ||
        b.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    return results;
  }
}

export const store = new Store();