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
import { Edit, Tag, MessageSquare } from "lucide-react";

interface VerseDisplayProps {
  verse: number;
  text: string;
  onCreateNote: (verseText: string) => void;
}

export const VerseDisplay = ({ verse, text, onCreateNote }: VerseDisplayProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagName, setTagName] = useState("");
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
    setIsTooltipOpen(false);
  };

  const handleAskChat = () => {
    toast({
      title: "Em breve",
      description: "Esta funcionalidade estará disponível em breve!",
    });
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
          <TooltipContent side="right" className="w-48 p-2">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm hover:bg-gray-100 w-full justify-start"
                onClick={handleCreateNote}
              >
                <Edit className="h-4 w-4" />
                Criar Anotação
              </Button>

              {isAddingTag ? (
                <div className="flex items-center gap-2">
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
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span id={`verse-${verse}`} className="text-sm">{text}</span>
    </div>
  );
};