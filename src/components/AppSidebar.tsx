import { useState } from "react";
import { Book, Tag, Search, Sun, Moon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebarContent } from "./sidebar/AppSidebarContent";
import { Book as BookType } from "@/types/Book";
import { QuizResult } from "@/types/Quiz";

interface AppSidebarProps {
  currentBook: BookType;
  onPageSelect?: (pageNumber: number) => void;
  noteCounts?: {
    bookNotes: number;
    chapterNotes: number;
    pageNotes: number;
  };
  tags?: { name: string; count: number }[];
  chapterLevels?: { [chapterId: string]: QuizResult };
  onViewChange?: (view: 'books' | 'tags' | 'library' | 'chat') => void;
  currentView: 'books' | 'tags' | 'library' | 'chat';
}

export function AppSidebar({ 
  currentBook, 
  onPageSelect, 
  noteCounts, 
  tags = [],
  chapterLevels = {},
  onViewChange,
  currentView
}: AppSidebarProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: isDarkMode ? "Tema claro ativado" : "Tema escuro ativado",
      description: `O tema foi alterado para ${isDarkMode ? "claro" : "escuro"}.`,
    });
  };

  if (isMobile) {
    return (
      <div className="mobile-navigation">
        <Tabs value={currentView} onValueChange={(value) => {
          onViewChange?.(value as 'books' | 'tags' | 'library');
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="books" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Livros
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Biblioteca
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Notas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  }

  return (
    <Sidebar className="w-[var(--sidebar-width)] min-w-[200px] border-r border-border">
      <SidebarContent>
        <AppSidebarContent
          currentBook={currentBook}
          onPageSelect={onPageSelect}
          noteCounts={noteCounts}
          tags={tags}
          chapterLevels={chapterLevels}
          onViewChange={onViewChange}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </SidebarContent>
    </Sidebar>
  );
}