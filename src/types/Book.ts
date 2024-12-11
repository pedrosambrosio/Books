export interface Page {
  id: string;
  number: number;
  title?: string;
  completed?: boolean;
  verses?: string[];
  annotationCount?: number;
  tags?: string[];
  notes?: string[];
  reference?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  pages: Page[];
  completedPages?: number;
  annotationCount?: number;
  tags?: string[];
  notes?: string[];
}

export interface Book {
  id: string;
  title: string;
  type: 'bible' | 'regular';
  description: string;
  chapters: Chapter[];
  completedChapters: number;
  annotationCount: number;
  tags?: string[];
  notes?: string[];
}

export interface GroupedBook {
  description: string;
  chapters: Chapter[];
  completedChapters: number;
  annotationCount: number;
  tags?: string[];
  notes?: string[];
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}