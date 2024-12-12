import { MessageCircle, StickyNote } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface TextSelectionTooltipProps {
  selectedText: string;
  onAskAI: (text: string) => void;
  onCreateNote: (text: string) => void;
  position: { x: number; y: number } | null;
}

export const TextSelectionTooltip = ({
  selectedText,
  onAskAI,
  onCreateNote,
  position,
}: TextSelectionTooltipProps) => {
  if (!position) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
      }}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="w-4 h-4 bg-primary rounded-full cursor-pointer" />
        </HoverCardTrigger>
        <HoverCardContent className="w-64 p-2">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start"
              onClick={() => onAskAI(selectedText)}
            >
              <MessageCircle className="h-4 w-4" />
              Perguntar para I.A
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start"
              onClick={() => onCreateNote(selectedText)}
            >
              <StickyNote className="h-4 w-4" />
              Criar anotação
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};