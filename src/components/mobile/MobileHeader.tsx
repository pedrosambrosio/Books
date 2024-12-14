import { Book, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MobileHeaderProps {
  currentTab: string;
  onViewChange?: (view: 'books' | 'tags' | 'library' | 'chat') => void;
}

export function MobileHeader({ currentTab, onViewChange }: MobileHeaderProps) {
  const handleChatClick = () => {
    onViewChange?.('chat');
  };

  const handleBooksClick = () => {
    onViewChange?.('books');
  };

  return (
    <div className="mobile-book-header">
      <Tabs value={currentTab} className="w-full max-w-[280px] mx-auto">
        <TabsList className="grid w-full grid-cols-2 h-9 bg-muted p-1 relative">
          <TabsTrigger 
            value="books" 
            onClick={handleBooksClick}
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground rounded"
          >
            <Book className="h-4 w-4" />
            Bíblia
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            onClick={handleChatClick}
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground rounded"
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}