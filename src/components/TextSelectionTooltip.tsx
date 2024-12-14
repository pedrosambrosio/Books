import { Button } from "@/components/ui/button";
import { Edit, Tag, MessageSquare, X, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CreateNoteDialog } from "./CreateNoteDialog";

interface TextSelectionTooltipProps {
  onCreateNote: () => void;
  position: { x: number; y: number } | null;
  hasTag?: boolean;
  onRemoveTag?: () => void;
  onTagAdded?: (tagName: string) => void;
  selectedText?: string;
}

export const TextSelectionTooltip = ({ 
  onCreateNote, 
  position, 
  hasTag,
  onRemoveTag,
  onTagAdded,
  selectedText 
}: TextSelectionTooltipProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagName, setTagName] = useState("");
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTag = () => {
    if (!tagName.trim()) {
      setIsAddingTag(false);
      return;
    }

    if (onTagAdded) {
      onTagAdded(tagName);
    }

    toast({
      title: "Tag adicionada",
      description: `A tag "${tagName}" foi adicionada ao texto selecionado.`,
    });

    setTagName("");
    setIsAddingTag(false);
  };

  const handleAskChat = () => {
    toast({
      title: "Em breve",
      description: "Esta funcionalidade estará disponível em breve!",
    });
  };

  const handleCreateNote = () => {
    setIsCreateNoteOpen(true);
  };

  if (!position) return null;

  return (
    <>
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 animate-scale-in flex gap-2 items-center transition-transform duration-15"
        style={{
          top: `${Math.max(position.y - 10, 10)}px`,
          left: `${position.x}px`,
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'auto',
        }}
      >
        {isAddingTag ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Nome da tag..."
                className="h-8 text-sm pr-10"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  } else if (e.key === 'Escape') {
                    setIsAddingTag(false);
                    setTagName("");
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddTag}
                className="absolute right-0 top-0 h-full px-2"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {hasTag ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100"
                onClick={onRemoveTag}
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <>
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
                  onClick={() => setIsAddingTag(true)}
                >
                  <Tag className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100"
                  onClick={handleAskChat}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        )}
      </div>

      <CreateNoteDialog
        isOpen={isCreateNoteOpen}
        onClose={() => setIsCreateNoteOpen(false)}
        initialReference={selectedText}
      />
    </>
  );
};