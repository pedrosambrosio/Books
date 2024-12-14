import { Book, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  currentTab: 'books' | 'tags' | 'library';
  currentView: 'bible' | 'chat';
  onViewChange: (view: 'bible' | 'chat') => void;
}

export function MobileNavigation({ currentTab, currentView, onViewChange }: MobileNavigationProps) {
  return (
    <>
      <div className="fixed top-4 left-0 right-0 px-4 z-10">
        <div className="bg-muted/20 rounded-lg p-2 flex justify-center gap-2 max-w-md mx-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange('bible')}
            className={cn(
              "flex-1 bg-background",
              currentView === 'bible' && "bg-white"
            )}
          >
            <Book className="h-4 w-4 mr-2" />
            Bíblia
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange('chat')}
            className={cn(
              "flex-1 bg-background",
              currentView === 'chat' && "bg-white"
            )}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>
    </>
  );
}