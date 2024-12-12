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
  existingTags?: string[];
  onTagCreate?: (tag: string, verseId: string) => void;
  onTagRemove?: (verseId: string) => void;
  hasTag?: boolean;
}

export const VerseDisplay = ({ 
  verse, 
  text, 
  onCreateNote,
  existingTags = [],
  onTagCreate,
  onTagRemove,
  hasTag = false
}: VerseDisplayProps) => {
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

    if (onTagCreate) {
      onTagCreate(tagName, `verse-${verse}`);
    }

    toast({
      title: "Tag adicionada",
      description: `A tag "${tagName}" foi adicionada ao versículo ${verse}.`,
    });

    setTagName("");
    setIsAddingTag(false);
    setIsTooltipOpen(false);
  };

  const handleRemoveTag = () => {
    if (onTagRemove) {
      onTagRemove(`verse-${verse}`);
      toast({
        title: "Tag removida",
        description: `A tag foi removida do versículo ${verse}.`,
      });
    }
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
          <TooltipContent side="right" className="p-2">
            <div className="flex items-center gap-4">
              {hasTag ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={handleRemoveTag}
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
                  {isAddingTag ? (
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
                  ) : (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                              onClick={handleCreateNote}
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
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span id={`verse-${verse}`} className="text-sm">{text}</span>
    </div>
  );
};