import { Button } from "@/components/ui/button";
import { Edit, Tag, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface TextSelectionTooltipProps {
  onCreateNote: () => void;
  position: { x: number; y: number } | null;
}

export const TextSelectionTooltip = ({ onCreateNote, position }: TextSelectionTooltipProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagName, setTagName] = useState("");
  const { toast } = useToast();

  if (!position) return null;

  const handleAddTag = () => {
    if (!tagName.trim()) {
      setIsAddingTag(false);
      return;
    }

    // Apply highlight style to selected text
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = `bg-[${tagName}]/20 px-1 rounded`;
      span.dataset.tag = tagName;
      range.surroundContents(span);
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

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 animate-fade-in flex flex-col gap-2"
      style={{
        top: `${Math.max(position.y - 10, 10)}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'auto',
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-sm hover:bg-gray-100 w-full justify-start"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onCreateNote();
        }}
      >
        <Edit className="h-4 w-4" />
        Criar Anotação
      </Button>

      {isAddingTag ? (
        <div className="flex items-center gap-2 px-2">
          <Input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Nome da tag..."
            className="h-8 text-sm"
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
            className="h-8"
          >
            OK
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-sm hover:bg-gray-100 w-full justify-start"
          onClick={() => setIsAddingTag(true)}
        >
          <Tag className="h-4 w-4" />
          Adicionar Tag
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-sm hover:bg-gray-100 w-full justify-start"
        onClick={handleAskChat}
      >
        <MessageSquare className="h-4 w-4" />
        Perguntar pro Chat
      </Button>
    </div>
  );
};