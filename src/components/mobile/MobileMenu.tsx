import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";

interface MobileMenuProps {
  currentView: 'books' | 'tags' | 'library';
  onViewChange: (view: 'books' | 'tags' | 'library') => void;
}

export function MobileMenu({ currentView, onViewChange }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetContent side="left" className="w-[80%] p-0">
        <AppSidebar
          currentBook={{
            id: "bible",
            title: "Bíblia",
            type: "bible",
            chapters: [],
            completedChapters: 0
          }}
          onViewChange={onViewChange}
        />
      </SheetContent>
    </Sheet>
  );
}