export interface Page {
  id: string;
  number: number;
  title?: string;
  completed: boolean;  // Changed from completed?: boolean to completed: boolean
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
  chapters: Chapter[];
  completedChapters?: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}