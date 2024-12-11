import { useState, useEffect } from "react";
import { Book, ChevronDown, ChevronRight, MessageSquare, Circle, CheckCircle } from "lucide-react";
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
  SidebarInput,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Book as BookType, GroupedBook } from "@/types/Book";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/services/mockApi";

const USE_MOCK_API = true;
const apiService = USE_MOCK_API ? mockApi : null;

export function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  // Fetch books using the selected API
  const { data: books = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ['books'],
    queryFn: () => apiService.books.getAll().then(response => response.data || []),
  });

  const groupedBooks = books.reduce((acc: { [key: string]: GroupedBook }, book) => {
    const { description, title } = book;

    if (!description) return acc;

    if (!acc[description]) {
      acc[description] = {
        description,
        chapters: [],
        completedChapters: 0,
        annotations: 0,
      };
    }

    acc[description].chapters = [
      ...acc[description].chapters,
      ...(book.chapters || []).map(chapter => ({
        ...chapter,
        title: title || 'Untitled Book',
        pages: chapter.pages || [],
      })),
    ];

    acc[description].completedChapters += book.completedChapters || 0;
    acc[description].annotations += book.annotations || 0;

    return acc;
  }, {});

  useEffect(() => {
    const handlePageCompleted = (event: CustomEvent<{
      currentPage: number;
      completed: boolean;
    }>) => {
      // Update the completion status in the local state
      const { currentPage, completed } = event.detail;
      // You would typically update this through your API
      console.log(`Page ${currentPage} marked as ${completed ? 'completed' : 'incomplete'}`);
    };

    window.addEventListener('pageCompleted', handlePageCompleted as EventListener);

    return () => {
      window.removeEventListener('pageCompleted', handlePageCompleted as EventListener);
    };
  }, []);

  const handlePageSelect = (pageId: string, verses: string[] = [], chapterId: string, isCompleted: boolean = false) => {
    setSelectedPage(pageId);
    
    const currentChapter = books
      .flatMap(book => book.chapters)
      .find(chapter => chapter.id === chapterId);
    
    if (currentChapter) {
      const currentPageIndex = currentChapter.pages.findIndex(page => page.id === pageId);
      
      const event = new CustomEvent('pageSelected', { 
        detail: { 
          verses,
          currentPage: currentPageIndex + 1,
          totalPages: currentChapter.pages.length,
          chapterId,
          isCompleted,
          onNextPage: () => {
            if (currentPageIndex < currentChapter.pages.length - 1) {
              const nextPage = currentChapter.pages[currentPageIndex + 1];
              handlePageSelect(nextPage.id, nextPage.verses, chapterId, nextPage.completed);
            }
          },
          onPreviousPage: () => {
            if (currentPageIndex > 0) {
              const prevPage = currentChapter.pages[currentPageIndex - 1];
              handlePageSelect(prevPage.id, prevPage.verses, chapterId, prevPage.completed);
            }
          }
        } 
      });
      window.dispatchEvent(event);
    }
  };

  const filteredBooks = Object.values(groupedBooks).filter(book => 
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="w-[var(--sidebar-width)] min-w-[200px] border-r border-border">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <SidebarInput
            type="text"
            placeholder="Pesquisar livros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-2">
              <SidebarGroupLabel>Livros</SidebarGroupLabel>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoadingBooks ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Carregando livros...
                  </div>
                ) : (
                  filteredBooks.map((book) => (
                    <Collapsible
                      key={book.description}
                      open={expandedBook === book.description}
                      onOpenChange={() => setExpandedBook(expandedBook === book.description ? null : book.description)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full px-4 py-2 hover:bg-accent rounded-lg transition-colors flex items-center justify-between ${
                            expandedBook === book.description ? 'bg-primary text-white' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            {expandedBook === book.description ? (
                              <ChevronDown className="h-4 w-4 mr-2" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-2" />
                            )}
                            <Book className="h-4 w-4 mr-2" />
                            <span>{book.description}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {book.annotations > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {book.annotations}
                              </span>
                            )}
                            <span>
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
                                  className={`w-full justify-between text-sm ${
                                    expandedChapter === chapter.id ? 'bg-primary text-white' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    {expandedChapter === chapter.id ? (
                                      <ChevronDown className="h-4 w-4 mr-2" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 mr-2" />
                                    )}
                                    {chapter.title}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    {chapter.annotations > 0 && (
                                      <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        {chapter.annotations}
                                      </span>
                                    )}
                                    <span>
                                      {chapter.completedPages || 0}/{(chapter.pages || []).length}
                                    </span>
                                  </div>
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="ml-6 space-y-1">
                                  {(chapter.pages || []).map((page) => (
                                    <Button
                                      key={page.id}
                                      variant="ghost"
                                      className={`w-full justify-between text-sm pl-8 ${
                                        selectedPage === page.id ? 'bg-primary text-white' : ''
                                      }`}
                                      onClick={() => handlePageSelect(page.id, page.verses, chapter.id, page.completed)}
                                    >
                                      <div className="flex items-center gap-2">
                                        {page.completed ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : (
                                          <Circle className="h-4 w-4" />
                                        )}
                                        <span>Página {page.number}</span>
                                      </div>
                                      {page.annotations > 0 && (
                                        <span className="flex items-center gap-1 text-xs">
                                          <MessageSquare className="h-3 w-3" />
                                          {page.annotations}
                                        </span>
                                      )}
                                    </Button>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}