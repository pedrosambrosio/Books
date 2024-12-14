import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { Switch } from "@/components/ui/switch";
import { Book, ChevronDown, Sun, Moon, Library, Tag } from "lucide-react";
import { SearchInput } from "@/components/search/SearchInput";
import { useState } from "react";
import { Book as BookType } from "@/types/Book";
import { QuizResult } from "@/types/Quiz";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  noteCounts = { bookNotes: 0, chapterNotes: 0, pageNotes: 0 },
  tags = [],
  chapterLevels = {},
  onViewChange,
  isDarkMode,
  toggleTheme,
}: AppSidebarContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const filteredBooks = [currentBook].filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="p-4">
        <ProfileMenu />
      </div>
      
      <div className="flex flex-col space-y-4 px-4">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onViewChange?.('books')}
          >
            <Book className="h-4 w-4 mr-2" />
            Livros
          </Button>
          <SearchInput onSearch={setSearchQuery} />
        </div>

        <div className="ml-4">
          {filteredBooks.map((book) => (
            <Collapsible
              key={book.id}
              open={expandedBook === book.id}
              onOpenChange={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-sm group"
                >
                  <div className="flex items-center">
                    {book.title}
                    <Badge variant="secondary" className="ml-2">
                      Notas {noteCounts.bookNotes}
                    </Badge>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-4 space-y-1">
                  {book.chapters.map((chapter) => (
                    <Collapsible
                      key={chapter.id}
                      open={expandedChapter === chapter.id}
                      onOpenChange={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-sm group"
                        >
                          <div className="flex items-center">
                            {chapter.title || `Capítulo ${chapter.number}`}
                            <span className="ml-2 text-muted-foreground">
                              ({chapter.completedPages}/{chapter.pages.length})
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-4 space-y-1">
                          {chapter.pages.map((page) => (
                            <Button
                              key={page.id}
                              variant="ghost"
                              className="w-full justify-between text-sm"
                              onClick={() => onPageSelect?.(page.number)}
                            >
                              <span>Página {page.number}</span>
                              <span className="text-muted-foreground">
                                ({page.completed ? '1' : '0'}/1)
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

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onViewChange?.('library')}
        >
          <Library className="h-4 w-4 mr-2" />
          Biblioteca
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onViewChange?.('tags')}
        >
          <Tag className="h-4 w-4 mr-2" />
          Notas
        </Button>
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