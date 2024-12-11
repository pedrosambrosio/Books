
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export interface Annotation {
  id: string;
  content: string;
  verseId: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}