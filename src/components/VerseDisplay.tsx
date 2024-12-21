import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Tag, MessageSquare, X, Check } from "lucide-react";

interface VerseDisplayProps {
  verse: number;
  text: string;
  onCreateNote: (verseText: string) => void;
  onTagAdded?: (tag: string) => void;
}

export const VerseDisplay = ({ verse, text, onCreateNote, onTagAdded }: VerseDisplayProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagName, setTagName] = useState("");
  const [hasTag, setHasTag] = useState(false);
  const { toast } = useToast();

  // Reset states when tooltip is closed
  useEffect(() => {
    if (!isTooltipOpen) {
      setIsAddingTag(false);
      setTagName("");
    }
  }, [isTooltipOpen]);

  // Load saved tag state from localStorage on mount
  useEffect(() => {
    const savedTags = localStorage.getItem(`verse-${verse}-tags`);
    if (savedTags) {
      setHasTag(true);
      const verseElement = document.getElementById(`verse-${verse}`);
      if (verseElement) {
        const span = document.createElement('span');
        span.className = `bg-[${savedTags}]/20 px-1 rounded`;
        span.dataset.tag = savedTags;
        span.textContent = text;
        verseElement.innerHTML = '';
        verseElement.appendChild(span);
      }
    }
  }, [verse, text]);

  const handleAddTag = () => {
    if (!tagName.trim()) {
      setIsAddingTag(false);
      return;
    }

    // Save tag to localStorage
    localStorage.setItem(`verse-${verse}-tags`, tagName);

    const verseElement = document.getElementById(`verse-${verse}`);
    if (verseElement) {
      const span = document.createElement('span');
      span.className = `bg-[${tagName}]/20 px-1 rounded`;
      span.dataset.tag = tagName;
      span.textContent = text;
      verseElement.innerHTML = '';
      verseElement.appendChild(span);
    }

    toast({
      title: "Tag adicionada",
      description: `A tag "${tagName}" foi adicionada ao versículo ${verse}.`,
    });

    if (onTagAdded) {
      onTagAdded(tagName);
    }

    setTagName("");
    setIsAddingTag(false);
    setHasTag(true);
    setIsTooltipOpen(false);
  };

  const handleRemoveTag = () => {
    localStorage.removeItem(`verse-${verse}-tags`);
    
    const verseElement = document.getElementById(`verse-${verse}`);
    if (verseElement) {
      verseElement.innerHTML = text;
    }

    setHasTag(false);
    setIsTooltipOpen(false);
    toast({
      title: "Tag removida",
      description: "A tag foi removida do versículo.",
    });
  };

  const handleCreateNote = () => {
    onCreateNote(`Gênesis 1:${verse} - ${text}`);
    setIsTooltipOpen(false);
  };

  return (
    <div className="flex gap-2 mb-2">
      <TooltipProvider>
        <Tooltip open={isTooltipOpen}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 min-w-[2rem] h-6 px-1"
              onMouseEnter={() => setIsTooltipOpen(true)}
              onMouseLeave={() => {
                if (!isAddingTag) {
                  setIsTooltipOpen(false);
                }
              }}
            >
              {verse}
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="p-2"
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => {
              if (!isAddingTag) {
                setIsTooltipOpen(false);
              }
            }}
          >
            {isAddingTag ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
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
                      setIsTooltipOpen(false);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddTag();
                  }}
                  className="absolute right-0 top-0 h-full px-2"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {hasTag ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateNote();
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAddingTag(true);
                      }}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "Em breve",
                          description: "Esta funcionalidade estará disponível em breve!",
                        });
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span id={`verse-${verse}`} className="text-sm">{text}</span>
    </div>
  );
};