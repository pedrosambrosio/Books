import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Tag, MessageSquare, X } from "lucide-react";

interface VerseDisplayProps {
  verse: number;
  text: string;
  onCreateNote: (verseText: string) => void;
}

export const VerseDisplay = ({ verse, text, onCreateNote }: VerseDisplayProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagName, setTagName] = useState("");
  const [hasTag, setHasTag] = useState(false);
  const { toast } = useToast();

  const handleCreateNote = () => {
    onCreateNote(`Gênesis 1:${verse} - ${text}`);
    setIsTooltipOpen(false);
  };

  const handleAddTag = () => {
    if (!tagName.trim()) {
      setIsAddingTag(false);
      return;
    }

    const verseElement = document.getElementById(`verse-${verse}`);
    if (verseElement) {
      const span = document.createElement('span');
      span.className = `bg-[${tagName}]/20 px-1 rounded`;
      span.dataset.tag = tagName;
      span.textContent = verseElement.textContent || '';
      verseElement.innerHTML = '';
      verseElement.appendChild(span);
    }

    toast({
      title: "Tag adicionada",
      description: `A tag "${tagName}" foi adicionada ao versículo ${verse}.`,
    });

    setTagName("");
    setIsAddingTag(false);
    setHasTag(true);
  };

  const handleRemoveTag = () => {
    const verseElement = document.getElementById(`verse-${verse}`);
    if (verseElement) {
      const taggedSpan = verseElement.querySelector('[data-tag]');
      if (taggedSpan) {
        const textContent = taggedSpan.textContent || '';
        verseElement.innerHTML = textContent;
      }
    }

    setHasTag(false);
    toast({
      title: "Tag removida",
      description: "A tag foi removida do versículo.",
    });
    setIsTooltipOpen(false);
  };

  const handleAskChat = () => {
    toast({
      title: "Em breve",
      description: "Esta funcionalidade estará disponível em breve!",
    });
    setIsTooltipOpen(false);
  };

  const handleTooltipOpenChange = (open: boolean) => {
    if (!open) {
      setIsAddingTag(false);
      setTagName("");
    }
    setIsTooltipOpen(open);
  };

  return (
    <div className="flex gap-2 mb-2">
      <TooltipProvider>
        <Tooltip open={isTooltipOpen} onOpenChange={handleTooltipOpenChange}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 min-w-[2rem] h-6 px-1"
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
            >
              {verse}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="p-2">
            {isAddingTag ? (
              <Input
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Nome da tag..."
                className="h-8 text-sm min-w-[150px]"
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
            ) : (
              <div className="flex items-center gap-2">
                {hasTag ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100"
                    onClick={handleRemoveTag}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100"
                    onClick={() => setIsAddingTag(true)}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                )}

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
                  onClick={handleAskChat}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span id={`verse-${verse}`} className="text-sm">{text}</span>
    </div>
  );
};