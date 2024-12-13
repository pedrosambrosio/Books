export interface Book {
  id: string;
  title: string;
  type?: string;
  chapters: {
    id: string;
    number: number;
    title?: string;
    pages: {
      id: string;
      number: number;
      title?: string;
      completed: boolean;
    }[];
    completedPages: number;
    notes?: number;
  }[];
  completedChapters: number;
  level?: {
    name: string;
    icon: string;
  };
}