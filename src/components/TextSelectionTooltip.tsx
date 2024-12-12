import { Button } from "@/components/ui/button";
import { Edit, Tag, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TagInput } from "./tag/TagInput";

interface TextSelectionTooltipProps {
  onCreateNote: () => void;
  position: { x: number; y: number } | null;
  existingTags?: string[];
  onTagCreate?: (tag: string, color: string) => void;
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
  const { toast } = useToast();

  const handleAddTag = (tagName: string, color: string) => {
    if (onTagCreate) {
      onTagCreate(tagName, color);
    }
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
        <TagInput
          onSubmit={handleAddTag}
          onCancel={() => setIsAddingTag(false)}
          existingTags={existingTags}
        />
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
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={onTagRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={onCreateNote}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => setIsAddingTag(true)}
            >
              <Tag className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={handleAskChat}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};