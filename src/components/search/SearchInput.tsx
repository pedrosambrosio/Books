import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "w-40" : "w-0"
        )}
      >
        <Input
          type="text"
          placeholder="Buscar livro..."
          className="h-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}