import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Tag, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface VerseTooltipActionsProps {
  onCreateNote: () => void;
  onAddTag: () => void;
}

export const VerseTooltipActions = ({ onCreateNote, onAddTag }: VerseTooltipActionsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleCreateNote = () => {
    if (!isMobile) {
      const createTaskForm = document.querySelector('.create-task-form');
      if (createTaskForm) {
        createTaskForm.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onCreateNote();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="p-2 hover:bg-gray-100"
        onClick={handleCreateNote}
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="p-2 hover:bg-gray-100"
        onClick={onAddTag}
      >
        <Tag className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="p-2 hover:bg-gray-100"
        onClick={() => {
          toast({
            title: "Em breve",
            description: "Esta funcionalidade estará disponível em breve!",
          });
        }}
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    </div>
  );
};