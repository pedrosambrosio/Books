import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { TextSelectionTooltip } from './TextSelectionTooltip';

interface ContentViewerProps {
  content: string;
  currentPage: number;
  totalPages: number;
  isBookCompleted: boolean;
  onPageChange: (page: number) => void;
  onMarkAsCompleted: () => void;
  onAskAI: (text: string) => void;
  onCreateNote: (text: string) => void;
}

export const ContentViewer = ({
  content,
  currentPage,
  totalPages,
  isBookCompleted,
  onPageChange,
  onMarkAsCompleted,
  onAskAI,
  onCreateNote,
}: ContentViewerProps) => {
  const [selectedText, setSelectedText] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedText("");
      setTooltipPosition(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectedText("");
      setTooltipPosition(null);
      return;
    }

    const text = selection.toString().trim();
    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setTooltipPosition({
        x: rect.left + (rect.width / 2),
        y: rect.top - 10,
      });
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
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMarkAsCompleted}
            className={isBookCompleted ? "text-[#09090B]" : "text-[#F4F4F5]"}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div 
        className="prose prose-sm max-w-none whitespace-pre-line"
        onMouseUp={handleTextSelection}
      >
        {content}
      </div>
      <TextSelectionTooltip
        selectedText={selectedText}
        position={tooltipPosition}
        onAskAI={onAskAI}
        onCreateNote={onCreateNote}
      />
    </div>
  );
};