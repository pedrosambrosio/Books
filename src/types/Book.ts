export interface Page {
  id: string;
  number: number;
  title?: string;
  completed?: boolean;
  verses?: string[];
  annotations?: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: Page[];
  completedPages?: number;
  annotations?: number;
}

export interface Book {
  id: string;
  title: string;
  type: 'bible' | 'regular';
  description: string;
  chapters: Chapter[];
  completedChapters?: number;
  annotations?: number;
}

export interface GroupedBook {
  description: string;
  chapters: Chapter[];
  completedChapters: number;
  annotations?: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}