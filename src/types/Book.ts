export interface Page {
  id: string;
  number: number;
  title: string;
  completed: boolean;
  notes: number;
}

export interface Chapter {
  id: string;
  number: number;
  title?: string;
  pages: Page[];
  completedPages: number;
  notes: number;
}

export interface Book {
  id: string;
  title: string;
  type: string;
  chapters: Chapter[];
  completedChapters: number;
}