import { ChapterQuiz } from "@/types/Quiz";

export const CHAPTER_QUIZZES: ChapterQuiz[] = [
  {
    chapterId: "genesis",
    questions: [
      {
        id: "q1",
        question: "Quem criou os céus e a terra no início?",
        options: ["Deus", "Os anjos", "O homem", "A natureza"],
        correctAnswer: 0
      },
      {
        id: "q2",
        question: "O que Deus criou no primeiro dia?",
        options: ["O sol e a lua", "A luz", "Os animais", "As plantas"],
        correctAnswer: 1
      },
      {
        id: "q3",
        question: "Em quantos dias Deus criou todas as coisas?",
        options: ["3 dias", "5 dias", "6 dias", "7 dias"],
        correctAnswer: 2
      },
      {
        id: "q4",
        question: "O que Deus fez no sétimo dia?",
        options: ["Criou o homem", "Descansou", "Criou os animais", "Criou as plantas"],
        correctAnswer: 1
      },
      {
        id: "q5",
        question: "De que Deus formou o homem?",
        options: ["Do ar", "Da água", "Do pó da terra", "Do fogo"],
        correctAnswer: 2
      }
    ]
  }
];