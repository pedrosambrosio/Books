export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Annotation {
  id: string;
  content: string;
  userId: string;
  pageId: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}