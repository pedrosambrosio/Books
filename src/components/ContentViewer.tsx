import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { TextSelectionTooltip } from "./TextSelectionTooltip";
import { VerseDisplay } from "./VerseDisplay";
import { cn } from "@/lib/utils";

interface ContentViewerProps {
  content: Array<{ verse: number; text: string }>;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isCompleted: boolean;
  onMarkAsCompleted: () => void;
  onCreateNoteFromSelection: (selectedText: string) => void;
  existingTags?: string[];
  onTagCreate?: (tag: string) => void;
}

export const ContentViewer = ({
  content,
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  isCompleted,
  onMarkAsCompleted,
  onCreateNoteFromSelection,
  existingTags = [],
  onTagCreate,
}: ContentViewerProps) => {
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [taggedVerses, setTaggedVerses] = useState<{ [key: string]: { name: string; color: string } }>(() => {
    const saved = localStorage.getItem(`tagged-verses-page-${currentPage}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const saved = localStorage.getItem(`tagged-verses-page-${currentPage}`);
    setTaggedVerses(saved ? JSON.parse(saved) : {});
  }, [currentPage]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setTooltipPosition(null);
        setSelectedText("");
        return;
      }

      const text = selection.toString().trim();
      if (!text) {
        setTooltipPosition(null);
        setSelectedText("");
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const tooltipX = rect.left + (rect.width / 2);
      const tooltipY = rect.top + scrollTop;

      setTooltipPosition({
        x: tooltipX,
        y: tooltipY,
      });
      setSelectedText(text);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const handleCreateNote = () => {
    if (selectedText) {
      onCreateNoteFromSelection(selectedText);
      setTooltipPosition(null);
      setSelectedText("");
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleTagCreate = (tag: string, color: string, verseId: string) => {
    const newTaggedVerses = {
      ...taggedVerses,
      [verseId]: { name: tag, color }
    };
    setTaggedVerses(newTaggedVerses);
    localStorage.setItem(`tagged-verses-page-${currentPage}`, JSON.stringify(newTaggedVerses));
    
    if (onTagCreate) {
      onTagCreate(tag);
    }

    const verseElement = document.getElementById(verseId);
    if (verseElement) {
      const span = document.createElement('span');
      span.className = 'px-1 rounded';
      span.style.backgroundColor = `${color}20`;
      span.dataset.tag = tag;
      span.textContent = verseElement.textContent || '';
      verseElement.innerHTML = '';
      verseElement.appendChild(span);
    }
  };

  const handleTagRemove = (verseId: string) => {
    const { [verseId]: removedTag, ...remainingTags } = taggedVerses;
    setTaggedVerses(remainingTags);
    localStorage.setItem(`tagged-verses-page-${currentPage}`, JSON.stringify(remainingTags));

    const verseElement = document.getElementById(verseId);
    if (verseElement) {
      verseElement.innerHTML = verseElement.textContent || '';
    }
  };

  useEffect(() => {
    // Apply tags when component mounts or page changes
    Object.entries(taggedVerses).forEach(([verseId, tagInfo]) => {
      const verseElement = document.getElementById(verseId);
      if (verseElement) {
        const span = document.createElement('span');
        span.className = 'px-1 rounded';
        span.style.backgroundColor = `${tagInfo.color}20`;
        span.dataset.tag = tagInfo.name;
        span.textContent = verseElement.textContent || '';
        verseElement.innerHTML = '';
        verseElement.appendChild(span);
      }
    });
  }, [taggedVerses, currentPage]);

  return (
    <div className="glass-card h-full rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Gênesis</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMarkAsCompleted}
            className={cn(
              "transition-colors",
              isCompleted 
                ? "text-[#09090B]" 
                : "text-[#F4F4F5]"
            )}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div 
        className="prose prose-sm max-w-none whitespace-pre-line select-text space-y-4"
        style={{ 
          userSelect: 'text',
          cursor: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text'
        }}
      >
        {content.map((verse) => (
          <VerseDisplay
            key={verse.verse}
            verse={verse.verse}
            text={verse.text}
            onCreateNote={onCreateNoteFromSelection}
            existingTags={existingTags}
            onTagCreate={handleTagCreate}
            onTagRemove={handleTagRemove}
            hasTag={`verse-${verse.verse}` in taggedVerses}
          />
        ))}
      </div>
      <TextSelectionTooltip
        position={tooltipPosition}
        onCreateNote={handleCreateNote}
        existingTags={existingTags}
        onTagCreate={(tag) => {
          const selection = window.getSelection();
          if (selection) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.className = `bg-[${tag}]/20 px-1 rounded`;
            span.dataset.tag = tag;
            range.surroundContents(span);
            if (onTagCreate) {
              onTagCreate(tag);
            }
          }
          setTooltipPosition(null);
          setSelectedText("");
        }}
      />
    </div>
  );
};