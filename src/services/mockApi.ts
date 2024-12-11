import { MOCK_BOOKS } from "@/mocks/bibleData";
import { Book } from "@/types/Book";
import { ApiResponse } from "./api";
import { Task } from "@/components/TaskCard";

export const mockApi = {
  books: {
    getAll: async (): Promise<ApiResponse<Book[]>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: MOCK_BOOKS });
        }, 500);
      });
    }
  },
  tasks: {
    getAll: async (): Promise<ApiResponse<Task[]>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            data: [] // Initial empty array for tasks
          });
        }, 500);
      });
    },
    create: async (task: Omit<Task, "id">): Promise<ApiResponse<Task>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              ...task,
              id: crypto.randomUUID()
            } as Task
          });
        }, 500);
      });
    },
    update: async (taskId: string, task: Partial<Task>): Promise<ApiResponse<Task>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              ...task,
              id: taskId
            } as Task
          });
        }, 500);
      });
    },
    delete: async (taskId: string): Promise<ApiResponse<void>> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: undefined });
        }, 500);
      });
    }
  }
};