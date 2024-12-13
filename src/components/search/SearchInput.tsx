import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch("");
  };

  return (
    <div className="flex items-center gap-2 relative">
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 flex items-center absolute right-0",
          isExpanded ? "w-40" : "w-0"
        )}
      >
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Buscar livro..."
            className="h-8 pr-8"
            value={searchValue}
            onChange={handleInputChange}
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute right-0 top-0"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}