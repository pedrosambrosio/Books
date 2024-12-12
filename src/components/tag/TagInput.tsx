import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagColorPicker } from "./TagColorPicker";
import { Check, Tag } from "lucide-react";

interface TagInputProps {
  onSubmit: (tagName: string, color: string) => void;
  onCancel: () => void;
  existingTags?: string[];
}

export const TagInput = ({ onSubmit, onCancel, existingTags = [] }: TagInputProps) => {
  const [tagName, setTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#9b87f5");

  const handleSubmit = () => {
    if (!tagName.trim()) {
      onCancel();
      return;
    }
    onSubmit(tagName, selectedColor);
    setTagName("");
    setSelectedColor("#9b87f5");
  };

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
      >
        <Tag className="h-4 w-4" />
      </Button>
      <div className="relative flex-1">
        <Input
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Nome da tag..."
          className="h-8 text-sm pr-8"
          list="existing-tags"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            } else if (e.key === 'Escape') {
              onCancel();
            }
          }}
        />
        <datalist id="existing-tags">
          {existingTags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>
        <div className="absolute right-1 top-1">
          <TagColorPicker
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSubmit}
        className="h-8 w-8"
      >
        <Check className="h-4 w-4" />
      </Button>
    </div>
  );
};