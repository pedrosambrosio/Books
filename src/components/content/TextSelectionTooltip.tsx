import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookmarkPlus } from "lucide-react";

interface TextSelectionTooltipProps {
  selectedText: string;
  position: { x: number; y: number } | null;
  onAskAI: (text: string) => void;
  onCreateNote: (text: string) => void;
}

export const TextSelectionTooltip = ({
  selectedText,
  position,
  onAskAI,
  onCreateNote,
}: TextSelectionTooltipProps) => {
  if (!position || !selectedText) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => onAskAI(selectedText)}
            >
              <MessageSquare className="h-4 w-4" />
              Perguntar para IA
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => onCreateNote(selectedText)}
            >
              <BookmarkPlus className="h-4 w-4" />
              Criar Anotação
            </Button>
          </div>
        </TooltipTrigger>
      </Tooltip>
    </div>
  );
};