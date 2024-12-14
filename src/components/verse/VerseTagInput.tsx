import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface VerseTagInputProps {
  tagName: string;
  onTagNameChange: (value: string) => void;
  onAddTag: () => void;
}

export const VerseTagInput = ({ tagName, onTagNameChange, onAddTag }: VerseTagInputProps) => {
  return (
    <div className="relative">
      <Input
        value={tagName}
        onChange={(e) => onTagNameChange(e.target.value)}
        placeholder="Nome da tag..."
        className="h-8 text-sm pr-10"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onAddTag();
          }
        }}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddTag}
        className="absolute right-0 top-0 h-full px-2"
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
};