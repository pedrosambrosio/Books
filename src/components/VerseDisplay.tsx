import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { VerseTooltipActions } from "./verse/VerseTooltipActions";
import { VerseTagInput } from "./verse/VerseTagInput";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const isMobile = useIsMobile();

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
  };

  const handleRemoveTag = () => {
    localStorage.removeItem(`verse-${verse}-tags`);
    
    const verseElement = document.getElementById(`verse-${verse}`);
    if (verseElement) {
      verseElement.innerHTML = text;
    }

    setHasTag(false);
    toast({
      title: "Tag removida",
      description: "A tag foi removida do versículo.",
    });
  };

  const handleCreateNote = () => {
    if (isMobile) {
      setIsCreateNoteOpen(true);
    } else {
      onCreateNote(`Gênesis 1:${verse} - ${text}`);
      setIsTooltipOpen(false);
    }
  };

  return (
    <div className="flex gap-2 mb-2">
      <TooltipProvider>
        <Tooltip>
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
              <VerseTagInput
                tagName={tagName}
                onTagNameChange={setTagName}
                onAddTag={handleAddTag}
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
                  <VerseTooltipActions
                    onCreateNote={handleCreateNote}
                    onAddTag={() => setIsAddingTag(true)}
                  />
                )}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span id={`verse-${verse}`} className="text-sm">{text}</span>

      <CreateNoteDialog
        isOpen={isCreateNoteOpen}
        onClose={() => setIsCreateNoteOpen(false)}
        initialReference={`Gênesis 1:${verse} - ${text}`}
      />
    </div>
  );
};