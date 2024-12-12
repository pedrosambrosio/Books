import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Star, BookOpen, Lightbulb, Compass } from "lucide-react";
import { QuizQuestion, QuizResult } from "@/types/Quiz";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface QuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  chapterId: string;
  onComplete: (result: QuizResult) => void;
}

const LEVEL_CONFIG = {
  mestre: {
    icon: Brain,
    color: "text-purple-500",
    description: "Você domina este capítulo",
    minScore: 0.9
  },
  avancado: {
    icon: Star,
    color: "text-yellow-500",
    description: "Conhecimento avançado do conteúdo",
    minScore: 0.7
  },
  intermediario: {
    icon: BookOpen,
    color: "text-blue-500",
    description: "Bom entendimento do material",
    minScore: 0.5
  },
  iniciante: {
    icon: Lightbulb,
    color: "text-green-500",
    description: "Começando a entender o conteúdo",
    minScore: 0.3
  },
  explorador: {
    icon: Compass,
    color: "text-gray-500",
    description: "Explorando o conteúdo",
    minScore: 0
  }
};

export function QuizDialog({ isOpen, onClose, questions, chapterId, onComplete }: QuizDialogProps) {
  const [currentAnswers, setCurrentAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex] = answerIndex;
    setCurrentAnswers(newAnswers);
  };

  const calculateLevel = (score: number, total: number): QuizResult['level'] => {
    const percentage = score / total;
    if (percentage >= LEVEL_CONFIG.mestre.minScore) return 'mestre';
    if (percentage >= LEVEL_CONFIG.avancado.minScore) return 'avancado';
    if (percentage >= LEVEL_CONFIG.intermediario.minScore) return 'intermediario';
    if (percentage >= LEVEL_CONFIG.iniciante.minScore) return 'iniciante';
    return 'explorador';
  };

  const handleSubmit = () => {
    const score = currentAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const result: QuizResult = {
      chapterId,
      score,
      totalQuestions: questions.length,
      level: calculateLevel(score, questions.length)
    };

    setQuizResult(result);
    setShowResults(true);
    onComplete(result);
  };

  const resetQuiz = () => {
    setCurrentAnswers(Array(questions.length).fill(-1));
    setShowResults(false);
    setQuizResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetQuiz}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showResults ? "Resultado do Quiz" : "Quiz do Capítulo"}
          </DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <p className="font-medium">
                  {index + 1}. {question.question}
                </p>
                <RadioGroup
                  value={currentAnswers[index].toString()}
                  onValueChange={(value) => handleAnswerSelect(index, parseInt(value))}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={optionIndex.toString()} id={`q${index}-a${optionIndex}`} />
                      <Label htmlFor={`q${index}-a${optionIndex}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button
              onClick={handleSubmit}
              disabled={currentAnswers.some((answer) => answer === -1)}
              className="w-full"
            >
              Enviar Respostas
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {quizResult && (
              <>
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    {(() => {
                      const LevelIcon = LEVEL_CONFIG[quizResult.level].icon;
                      return (
                        <LevelIcon
                          className={cn(
                            "w-16 h-16",
                            LEVEL_CONFIG[quizResult.level].color
                          )}
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold capitalize">
                      Nível: {quizResult.level}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {LEVEL_CONFIG[quizResult.level].description}
                    </p>
                  </div>
                  <div className="text-xl font-bold">
                    Pontuação: {quizResult.score}/{quizResult.totalQuestions}
                  </div>
                </div>
                <Button onClick={resetQuiz} className="w-full">
                  Fechar
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}