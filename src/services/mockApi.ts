import { MOCK_BOOKS } from "@/mocks/bibleData";
import { Book } from "@/types/Book";
import { ApiResponse } from "./api";

export const mockApi = {
  books: {
    getAll: async (): Promise<{ data: Book[] }> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: MOCK_BOOKS });
        }, 500);
      });
    }
  }
};