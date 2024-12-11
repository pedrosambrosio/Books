export interface Page {
  id: string;
  number: number;
  title?: string;
  completed?: boolean;
  verses?: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: Page[];
  completedPages?: number;
}

export interface Book {
  id: string;
  title: string;
  type: 'bible' | 'regular';
  description: string;
  chapters: Chapter[];
  completedChapters?: number;
}

export interface GroupedBook {
  description: string;
  chapters: Chapter[];
  completedChapters: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}