import { Book, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MobileHeaderProps {
  currentTab: 'personal' | 'chat';  // Updated to match TabType
  onTabChange: (tab: 'personal' | 'chat') => void;  // Updated to be more specific
  onViewChange: (view: 'books' | 'tags' | 'library' | 'chat') => void;
}

export function MobileHeader({ currentTab, onTabChange, onViewChange }: MobileHeaderProps) {
  const handleBooksClick = () => {
    onTabChange('personal');
  };

  const handleChatClick = () => {
    onTabChange('chat');
    onViewChange('chat');
  };

  return (
    <div className="px-4 py-2">
      <Tabs value={currentTab} className="w-full max-w-[280px] mx-auto">
        <TabsList className="grid w-full grid-cols-2 h-9 bg-muted p-1 relative">
          <TabsTrigger 
            value="personal" 
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