import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface TextSelectionTooltipProps {
  onCreateNote: () => void;
  position: { x: number; y: number } | null;
}

export const TextSelectionTooltip = ({ onCreateNote, position }: TextSelectionTooltipProps) => {
  if (!position) return null;

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 animate-fade-in"
      style={{
        top: `${Math.max(position.y - 10, 10)}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-sm hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation();
          onCreateNote();
        }}
      >
        <Edit className="h-4 w-4" />
        Criar Anotação
      </Button>
    </div>
  );
};