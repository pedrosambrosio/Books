import { useState } from "react";
import { Book, ChevronDown, ChevronRight, Plus, Tags, Circle, CheckCircle, MessageSquare } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Book as BookType, GroupedBook } from "@/types/Book";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { mockApi } from "@/services/mockApi";

const USE_MOCK_API = true;
const apiService = USE_MOCK_API ? mockApi : api;

export function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: booksResponse, isLoading: isLoadingBooks } = useQuery<{ data: BookType[] }>({
    queryKey: ['books'],
    queryFn: () => apiService.books.getAll(),
  });

  const books = booksResponse?.data || [];

  const groupedBooks = books.reduce((acc: { [key: string]: GroupedBook }, book) => {
    const { description, title } = book;

    if (!description) return acc;

    if (!acc[description]) {
      acc[description] = {
        description,
        chapters: [],
        completedChapters: 0,
        annotationCount: 0,
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
    acc[description].annotationCount += book.annotationCount || 0;

    return acc;
  }, {});

  const handlePageSelect = (pageId: string, verses: string[] = [], chapterId: string) => {
    setSelectedPage(pageId);
    // Find all pages in the current chapter
    const currentChapter = books
      .flatMap(book => book.chapters)
      .find(chapter => chapter.id === chapterId);
    
    if (currentChapter) {
      const currentPageIndex = currentChapter.pages.findIndex(page => page.id === pageId);
      // Emit an event with page navigation data
      const event = new CustomEvent('pageSelected', { 
        detail: { 
          verses,
          currentPage: currentPageIndex + 1,
          totalPages: currentChapter.pages.length,
          chapterId,
          pageId,
          onNextPage: () => {
            if (currentPageIndex < currentChapter.pages.length - 1) {
              const nextPage = currentChapter.pages[currentPageIndex + 1];
              handlePageSelect(nextPage.id, nextPage.verses, chapterId);
            }
          },
          onPreviousPage: () => {
            if (currentPageIndex > 0) {
              const prevPage = currentChapter.pages[currentPageIndex - 1];
              handlePageSelect(prevPage.id, prevPage.verses, chapterId);
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
                        <SidebarMenuButton className="w-full px-4 py-2 hover:bg-accent rounded-lg transition-colors">
                          {expandedBook === book.description ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          )}
                          <Book className="h-4 w-4 mr-2" />
                          <span>{book.description}</span>
                          <div className="ml-auto flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {book.completedChapters}/{book.chapters.length}
                            </span>
                            {book.annotationCount > 0 && (
                              <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                <MessageSquare className="h-3 w-3" />
                                {book.annotationCount}
                              </div>
                            )}
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
                                >
                                  {expandedChapter === chapter.id ? (
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                  )}
                                  {chapter.title}
                                  <div className="ml-auto flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      {chapter.completedPages || 0}/{(chapter.pages || []).length}
                                    </span>
                                    {(chapter.annotationCount || 0) > 0 && (
                                      <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                        <MessageSquare className="h-3 w-3" />
                                        {chapter.annotationCount}
                                      </div>
                                    )}
                                  </div>
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="ml-6 space-y-1">
                                  {(chapter.pages || []).map((page) => (
                                    <Button
                                      key={page.id}
                                      variant="ghost"
                                      className={`w-full justify-start text-sm pl-8 ${
                                        selectedPage === page.id ? "bg-accent text-accent-foreground" : ""
                                      }`}
                                      onClick={() => handlePageSelect(page.id, page.verses, chapter.id)}
                                    >
                                      {page.completed ? (
                                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                                      ) : (
                                        <Circle className="h-4 w-4 mr-2" />
                                      )}
                                      Página {page.number}
                                      {(page.annotationCount || 0) > 0 && (
                                        <div className="ml-auto flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                          <MessageSquare className="h-3 w-3" />
                                          {page.annotationCount}
                                        </div>
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
