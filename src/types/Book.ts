export interface Page {
  id: string;
  number: number;
  title?: string;
  completed: boolean;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: Page[];
  completedPages: number;  // Changed from completedPages?: number to completedPages: number
}

export interface Book {
  id: string;
  title: string;
  type: 'bible' | 'regular';
  chapters: Chapter[];
  completedChapters?: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}