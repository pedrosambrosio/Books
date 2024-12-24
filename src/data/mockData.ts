import { Book } from "@/types/Book";

export const BIBLE_BOOK: Book = {
  id: "1",
  title: "Genesis",
  description: "First book of the Bible",
  chapters: [
    {
      id: "1",
      number: 1,
      title: "Creation",
      pages: [
        { id: "1", number: 1, completed: false },
        { id: "2", number: 2, completed: false },
        { id: "3", number: 3, completed: false }
      ],
      completedPages: 0
    }
  ],
  completedChapters: 0
};