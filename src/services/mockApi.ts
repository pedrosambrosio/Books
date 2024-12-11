import { Book } from "@/types/Book";

const mockBooks: Book[] = [
  {
    id: "1",
    title: "Gênesis",
    type: "bible" as const,
    description: "Bíblia",
    chapters: [
      {
        id: "genesis-1",
        title: "Gênesis 1",
        number: 1,
        pages: [
          {
            id: "genesis-1-1",
            number: 1,
            verses: [
              "1 No princípio, Deus criou os céus e a terra.",
              "2 Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.",
              // Add more verses as needed
            ]
          },
          // Add more pages as needed
        ],
        completedPages: 0
      }
    ],
    completedChapters: 0
  }
];

export const mockApi = {
  books: {
    getAll: async () => {
      return {
        data: mockBooks
      };
    }
  }
};