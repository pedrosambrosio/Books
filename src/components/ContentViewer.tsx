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
  onTagAdded?: (tag: string) => void;
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
  onTagAdded,
}: ContentViewerProps) => {
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");

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

  return (
    <div className="glass-card h-full rounded-lg p-4 md:p-6 mb-16">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Gênesis</h2>
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
            onTagAdded={onTagAdded}
          />
        ))}
      </div>
      <TextSelectionTooltip
        position={tooltipPosition}
        onCreateNote={handleCreateNote}
      />
    </div>
  );
};