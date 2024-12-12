import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Star, BookOpen, Lightbulb, Compass } from "lucide-react";
import { QuizQuestion, QuizResult } from "@/types/Quiz";
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (showResults && quizResult && (quizResult.level === 'mestre' || quizResult.level === 'avancado')) {
      triggerConfetti();
    }
  }, [showResults, quizResult]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0, y: 0.6 }
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 1, y: 0.6 }
    });
  };

  const calculateResults = () => {
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const level = calculateLevel(score, questions.length);
    
    const result: QuizResult = {
      chapterId,
      score,
      totalQuestions: questions.length,
      level
    };

    setQuizResult(result);
    setShowResults(true);
    onComplete(result);
  };

  const calculateLevel = (score: number, total: number): QuizResult['level'] => {
    const percentage = score / total;
    if (percentage >= LEVEL_CONFIG.mestre.minScore) return 'mestre';
    if (percentage >= LEVEL_CONFIG.avancado.minScore) return 'avancado';
    if (percentage >= LEVEL_CONFIG.intermediario.minScore) return 'intermediario';
    if (percentage >= LEVEL_CONFIG.iniciante.minScore) return 'iniciante';
    return 'explorador';
  };

  const handleCloseQuiz = () => {
    if (!showResults) {
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers(Array(questions.length).fill(-1));
    setShowResults(false);
    setQuizResult(null);
    onClose();
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseQuiz}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {showResults ? "Resultado do Quiz" : "Quiz do Capítulo"}
          </DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground mb-4">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </div>
            
            <div className="space-y-4">
              <p className="font-medium">{currentQuestion.question}</p>
              <RadioGroup
                value={answers[currentQuestionIndex].toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              >
                {currentQuestion.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={optionIndex.toString()} id={`q${currentQuestionIndex}-a${optionIndex}`} />
                    <Label htmlFor={`q${currentQuestionIndex}-a${optionIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={answers[currentQuestionIndex] === -1}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Próxima"}
              </Button>
            </div>
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