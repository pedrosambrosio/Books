import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { TextSelectionTooltip } from "./TextSelectionTooltip";
import { cn } from "@/lib/utils";

interface ContentViewerProps {
  content: string;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isCompleted: boolean;
  onMarkAsCompleted: () => void;
  onCreateNoteFromSelection: (selectedText: string) => void;
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
}: ContentViewerProps) => {
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setTooltipPosition(null);
        setSelectedText("");
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, []);

  const handleTextSelection = (e: React.MouseEvent | React.TouchEvent) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
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
    
    setTooltipPosition({
      x: rect.left + (rect.width / 2),
      y: rect.top + scrollTop,
    });
    setSelectedText(text);
  };

  const handleCreateNote = () => {
    if (selectedText) {
      onCreateNoteFromSelection(selectedText);
      setTooltipPosition(null);
      setSelectedText("");
      window.getSelection()?.removeAllRanges();
    }
  };

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
        className="prose prose-sm max-w-none whitespace-pre-line select-text"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        {content}
      </div>
      <TextSelectionTooltip
        position={tooltipPosition}
        onCreateNote={handleCreateNote}
      />
    </div>
  );
};