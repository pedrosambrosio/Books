export interface TaskFolder {
  id: string;
  name: string;
  tasks: string[]; // Array of task IDs
  bibleBook?: string; // Nome do livro da Bíblia
  chapters?: number[]; // Capítulos associados
}