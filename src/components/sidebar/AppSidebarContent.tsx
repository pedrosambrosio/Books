import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { Switch } from "@/components/ui/switch";
import { Book, ChevronDown, Sun, Moon, MessageSquare } from "lucide-react";
import { SearchInput } from "@/components/search/SearchInput";
import { useState } from "react";
import { Book as BookType } from "@/types/Book";
import { QuizResult } from "@/types/Quiz";
import { LevelIcon } from "@/components/quiz/LevelIcon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";

interface AppSidebarContentProps {
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
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function AppSidebarContent({
  currentBook,
  onPageSelect,
  noteCounts,
  tags = [],
  chapterLevels = {},
  onViewChange,
  isDarkMode,
  toggleTheme,
}: AppSidebarContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredBooks = [currentBook].filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageClick = (pageNumber: number) => {
    if (onPageSelect) {
      onPageSelect(pageNumber);
      onViewChange?.('books');
    }
  };

  const handleChatClick = () => {
    onViewChange?.('chat');
    toast({
      title: "Chat em breve",
      description: "O chat estará disponível em breve.",
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="p-4">
        <ProfileMenu />
      </div>
      
      <div className="flex items-center justify-between px-4 py-1">
        <SearchInput onSearch={setSearchQuery} />
      </div>

      <div className="mobile-book-header md:hidden">
        <button 
          className="mobile-header-button"
          onClick={() => onViewChange?.('books')}
        >
          <Book className="h-4 w-4" />
          Minhas Notas
        </button>
        <button 
          className="mobile-header-button"
          onClick={handleChatClick}
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
      </div>

      <div className="hidden md:block">
        {filteredBooks.map((book) => (
          <Collapsible
            key={book.id}
            open={expandedBook === book.id}
            onOpenChange={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => onViewChange?.('books')}
              >
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
              </Button>
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
                            onClick={() => handlePageClick(page.number)}
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
      </div>

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
  );
}
