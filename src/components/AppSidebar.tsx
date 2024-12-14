import { useState } from "react";
import { Book, ChevronDown, Tag, Search, Sun, Moon } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Book as BookType } from "@/types/Book";
import { QuizResult } from "@/types/Quiz";
import { LevelIcon } from "@/components/quiz/LevelIcon";
import { SearchInput } from "@/components/search/SearchInput";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";

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
  onViewChange?: (view: 'books' | 'tags' | 'library') => void;
}

export function AppSidebar({ 
  currentBook, 
  onPageSelect, 
  noteCounts, 
  tags = [],
  chapterLevels = {},
  onViewChange
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'books' | 'tags' | 'library'>('books');
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

  const handleTabChange = (value: string) => {
    setCurrentView(value as 'books' | 'tags' | 'library');
    onViewChange?.(value as 'books' | 'tags' | 'library');
  };

  const filteredBooks = [currentBook].filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <Tabs value={currentView} onValueChange={handleTabChange} className="w-full">
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
        <ScrollArea className="h-[calc(100vh-2rem)]">
          <div className="p-4">
            <ProfileMenu />
          </div>
          
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-1">
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => onViewChange?.('books')}
              >
                <SidebarGroupLabel className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors">
                  Livros
                </SidebarGroupLabel>
              </Button>
              <SearchInput onSearch={setSearchQuery} />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredBooks.map((book) => (
                  <Collapsible
                    key={book.id}
                    open={expandedBook === book.id}
                    onOpenChange={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full px-4 py-2 hover:bg-accent rounded-lg transition-colors">
                        {expandedBook === book.id ? (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                          <Book className="h-4 w-4 mr-2" />
                        )}
                        <span className={expandedBook === book.id ? "text-[#09090B]" : "text-[#71717A]"}>{book.title}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            notas {noteCounts?.bookNotes || 0}
                          </span>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                            {book.completedChapters}/{book.chapters.length}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-8 space-y-1">
                        {book.chapters.map((chapter) => (
                          <Collapsible
                            key={chapter.id}
                            open={expandedChapter === chapter.id}
                            onOpenChange={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                onClick={() => onViewChange?.('books')}
                              >
                                {expandedChapter === chapter.id ? (
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                ) : (
                                  <Book className="h-4 w-4 mr-2" />
                                )}
                                <span className={expandedChapter === chapter.id ? "text-[#09090B]" : "text-[#71717A]"}>{chapter.title || `Capítulo ${chapter.number}`}</span>
                                <div className="ml-auto flex items-center gap-2">
                                  {chapterLevels[chapter.id] && (
                                    <LevelIcon level={chapterLevels[chapter.id].level} />
                                  )}
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                    {noteCounts?.chapterNotes || 0}
                                  </span>
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                    {chapter.completedPages}/{chapter.pages.length}
                                  </span>
                                </div>
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="ml-6 space-y-1">
                                {chapter.pages.map((page) => (
                                  <Button
                                    key={page.id}
                                    variant="ghost"
                                    className={`w-full justify-start text-sm pl-8 ${page.completed ? "text-[#09090B]" : "text-[#71717A]"}`}
                                    onClick={() => onPageSelect?.(page.number)}
                                  >
                                    <span className="flex items-center gap-2">
                                      Página {page.number}
                                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full ml-auto">
                                        {noteCounts?.pageNotes || 0}
                                      </span>
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-0.5">
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => onViewChange?.('library')}
              >
                <SidebarGroupLabel className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors">
                  Biblioteca
                </SidebarGroupLabel>
              </Button>
            </div>
          </SidebarGroup>

          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-0.5">
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => onViewChange?.('tags')}
              >
                <SidebarGroupLabel className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors">
                  Notas
                </SidebarGroupLabel>
              </Button>
            </div>
          </SidebarGroup>

          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex items-center justify-between p-2 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}