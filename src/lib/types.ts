export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  folderId: string;
  tags: string[];
  favicon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface AppState {
  bookmarks: Bookmark[];
  folders: Folder[];
  tags: Tag[];
}