import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TAG_COLORS = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#D6BCFA", // Light Purple
  "#E5DEFF", // Soft Purple
  "#8B5CF6", // Vivid Purple
  "#D946EF", // Magenta Pink
];

interface TagColorPickerProps {
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}

export const TagColorPicker = ({ onColorSelect, selectedColor }: TagColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          style={{ 
            color: selectedColor,
            backgroundColor: selectedColor ? `${selectedColor}20` : undefined 
          }}
        >
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-4 gap-2">
          {TAG_COLORS.map((color) => (
            <Button
              key={color}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};