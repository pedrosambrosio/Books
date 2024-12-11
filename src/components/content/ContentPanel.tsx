import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContentPanelProps {
  verses: string[];
  currentPage: number;
  totalPages: number;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({
  verses,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  onComplete,
  isCompleted = false,
}) => {
  const { toast } = useToast();

  const handleComplete = () => {
    onComplete?.();
    toast({
      title: isCompleted ? "Página marcada como não lida" : "Página marcada como lida",
      description: `A página ${currentPage} foi marcada como ${isCompleted ? 'não lida' : 'lida'}.`,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="glass-card rounded-lg p-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Conteúdo</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPreviousPage}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNextPage}
              disabled={currentPage === totalPages}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleComplete}
              className={isCompleted ? "text-green-500" : ""}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {verses.map((verse, index) => (
            <p key={index} className="text-muted-foreground">
              {verse}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};