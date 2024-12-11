export const GENESIS_MOCK = {
  description: "Bíblia",
  chapters: [
    {
      id: "genesis-1",
      title: "Gênesis",
      number: 1,
      pages: [
        {
          id: "genesis-1-1",
          number: 1,
          verses: [
            "1 No princípio, Deus criou os céus e a terra.",
            "2 Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.",
            "3 Disse Deus: 'Haja luz', e houve luz.",
            "4 Deus viu que a luz era boa, e separou a luz das trevas.",
            "5 Deus chamou à luz dia, e às trevas chamou noite. Passaram-se a tarde e a manhã; esse foi o primeiro dia."
          ]
        },
        {
          id: "genesis-1-2",
          number: 2,
          verses: [
            "6 E disse Deus: 'Haja entre as águas um firmamento que separe águas de águas'.",
            "7 Então Deus fez o firmamento e separou as águas que ficaram abaixo do firmamento das que ficaram por cima. E assim foi.",
            "8 Ao firmamento Deus chamou céu. Passaram-se a tarde e a manhã; esse foi o segundo dia."
          ]
        },
        {
          id: "genesis-1-3",
          number: 3,
          verses: [
            "9 E disse Deus: 'Ajuntem-se num só lugar as águas que estão debaixo do céu, e apareça a parte seca'. E assim foi.",
            "10 À parte seca Deus chamou terra, e chamou mares ao conjunto das águas. E Deus viu que ficou bom."
          ]
        }
      ],
      completedPages: 0
    }
  ],
  completedChapters: 0
};

export const MOCK_BOOKS = [
  {
    id: "bible-1",
    title: "Gênesis",
    type: "bible",
    description: "Bíblia",
    chapters: GENESIS_MOCK.chapters,
    completedChapters: 0
  }
];