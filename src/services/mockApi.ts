import { MOCK_BOOKS } from "@/mocks/bibleData";
import { Book } from "@/types/Book";
import { ApiResponse } from "./api";
import { Task } from "@/components/TaskCard";

// In-memory storage for mock data
let mockBooks = [...MOCK_BOOKS];
let mockTasks: Task[] = [];

export const mockApi = {
  books: {
    getAll: async (): Promise<ApiResponse<Book[]>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: mockBooks });
        }, 500);
      });
    },
    update: async (bookId: string, updates: Partial<Book>): Promise<ApiResponse<Book>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockBooks = mockBooks.map(book => 
            book.id === bookId ? { ...book, ...updates } : book
          );
          const updatedBook = mockBooks.find(book => book.id === bookId);
          resolve({ data: updatedBook as Book });
        }, 500);
      });
    }
  },
  tasks: {
    getAll: async (): Promise<ApiResponse<Task[]>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: mockTasks });
        }, 500);
      });
    },
    create: async (task: Omit<Task, "id">): Promise<ApiResponse<Task>> => {
      return new Promise((resolve) => {
        const newTask = {
          ...task,
          id: crypto.randomUUID()
        } as Task;
        mockTasks = [newTask, ...mockTasks];
        resolve({ data: newTask });
      });
    },
    update: async (taskId: string, task: Partial<Task>): Promise<ApiResponse<Task>> => {
      return new Promise((resolve) => {
        mockTasks = mockTasks.map(t => 
          t.id === taskId ? { ...t, ...task } : t
        );
        const updatedTask = mockTasks.find(t => t.id === taskId);
        resolve({ data: updatedTask as Task });
      });
    },
    delete: async (taskId: string): Promise<ApiResponse<void>> => {
      return new Promise((resolve) => {
        mockTasks = mockTasks.filter(t => t.id !== taskId);
        resolve({ data: undefined });
      });
    }
  },
  pages: {
    update: async (bookId: string, chapterId: string, pageId: string, updates: any): Promise<ApiResponse<Book>> => {
      return new Promise((resolve) => {
        mockBooks = mockBooks.map(book => {
          if (book.id === bookId) {
            const updatedChapters = book.chapters.map(chapter => {
              if (chapter.id === chapterId) {
                const updatedPages = chapter.pages.map(page => 
                  page.id === pageId ? { ...page, ...updates } : page
                );
                const completedPages = updatedPages.filter(p => p.completed).length;
                return { ...chapter, pages: updatedPages, completedPages };
              }
              return chapter;
            });
            const completedChapters = updatedChapters.filter(
              chapter => chapter.completedPages === chapter.pages.length
            ).length;
            return { ...book, chapters: updatedChapters, completedChapters };
          }
          return book;
        });
        resolve({ data: mockBooks.find(b => b.id === bookId) as Book });
      });
    }
  }
};