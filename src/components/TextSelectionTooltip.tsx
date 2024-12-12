import { Button } from "@/components/ui/button";
import { Edit, Tag, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextSelectionTooltipProps {
  onCreateNote: () => void;
  position: { x: number; y: number } | null;
  existingTags?: string[];
  onTagCreate?: (tag: string) => void;
  onTagRemove?: () => void;
  hasTag?: boolean;
}

export const TextSelectionTooltip = ({ 
  onCreateNote, 
  position,
  existingTags = [],
  onTagCreate,
  onTagRemove,
  hasTag = false
}: TextSelectionTooltipProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagName, setTagName] = useState("");
  const { toast } = useToast();

  const handleAddTag = () => {
    if (!tagName.trim()) {
      setIsAddingTag(false);
      return;
    }

    if (onTagCreate) {
      onTagCreate(tagName);
    }

    setTagName("");
    setIsAddingTag(false);
  };

  const handleAskChat = () => {
    toast({
      title: "Em breve",
      description: "Esta funcionalidade estará disponível em breve!",
    });
  };

  if (!position) return null;

  if (isAddingTag) {
    return (
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 animate-fade-in"
        style={{
          top: `${Math.max(position.y - 10, 10)}px`,
          left: `${position.x}px`,
          transform: 'translate(-50%, -100%)',
        }}
      >
        <div className="flex items-center gap-2">
          <Input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Nome da tag..."
            className="h-8 text-sm min-w-[150px]"
            autoFocus
            list="existing-tags"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              } else if (e.key === 'Escape') {
                setIsAddingTag(false);
                setTagName("");
              }
            }}
          />
          <datalist id="existing-tags">
            {existingTags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddTag}
            className="h-8"
          >
            OK
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 animate-fade-in"
      style={{
        top: `${Math.max(position.y - 10, 10)}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="flex items-center gap-4">
        {hasTag ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={onTagRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="animate-fade-in">
                <span className="text-sm">Remover Tag</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={onCreateNote}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="animate-fade-in">
                  <span className="text-sm">Criar Anotação</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => setIsAddingTag(true)}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="animate-fade-in">
                  <span className="text-sm">Adicionar Tag</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={handleAskChat}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="animate-fade-in">
                  <span className="text-sm">Perguntar pro Chat</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
};