import { Book, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  currentView: 'bible' | 'chat';
  onViewChange: (view: 'bible' | 'chat') => void;
}

export function MobileNavigation({ currentView, onViewChange }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
      <div className="max-w-md mx-auto flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewChange('bible')}
          className={cn(
            "flex-1 bg-background",
            currentView === 'bible' && "bg-white dark:bg-zinc-800"
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
            currentView === 'chat' && "bg-white dark:bg-zinc-800"
          )}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat
        </Button>
      </div>
    </div>
  );
}