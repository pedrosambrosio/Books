import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit } from "lucide-react";

interface VerseDisplayProps {
  verse: number;
  text: string;
  onCreateNote: (verseText: string) => void;
}

export const VerseDisplay = ({ verse, text, onCreateNote }: VerseDisplayProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleCreateNote = () => {
    onCreateNote(`Gênesis 1:${verse} - ${text}`);
    setIsTooltipOpen(false);
  };

  return (
    <div className="flex gap-2 mb-2">
      <TooltipProvider>
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 min-w-[2rem] h-6 px-1"
            >
              {verse}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2 cursor-pointer" onClick={handleCreateNote}>
            <Edit className="h-4 w-4" />
            <span>Criar Anotação</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className="text-sm">{text}</span>
    </div>
  );
};