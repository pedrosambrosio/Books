import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  currentView: 'books' | 'tags' | 'library';
  onViewChange: (view: 'books' | 'tags' | 'library') => void;
}

export function MobileMenu({ currentView, onViewChange }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-2 left-2 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] p-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                currentView === 'books' && "bg-accent"
              )}
              onClick={() => onViewChange('books')}
            >
              Livros
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                currentView === 'library' && "bg-accent"
              )}
              onClick={() => onViewChange('library')}
            >
              Biblioteca
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                currentView === 'tags' && "bg-accent"
              )}
              onClick={() => onViewChange('tags')}
            >
              Notas
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}