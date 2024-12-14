import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

interface MobileMenuProps {
  currentView: 'books' | 'tags' | 'library';
  onViewChange: (view: 'books' | 'tags' | 'library') => void;
}

export function MobileMenu({ currentView, onViewChange }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background p-4 border-b border-border">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[var(--sidebar-width)]">
          <AppSidebar
            currentView={currentView}
            onViewChange={(view) => {
              onViewChange(view);
              setIsOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}