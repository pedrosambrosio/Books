export interface Page {
  id: string;
  number: number;
  title?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title?: string;
  pages: Page[];
}

export interface Book {
  id: string;
  title: string;
  type: 'bible' | 'regular';
  chapters: Chapter[];
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}