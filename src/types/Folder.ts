export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  type: 'pdf' | 'doc' | 'video' | 'text';
  url?: string;
  content?: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}