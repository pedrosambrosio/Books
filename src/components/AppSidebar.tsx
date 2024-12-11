import { useState } from "react";
import { Book, ChevronDown, ChevronRight } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Book as BookType } from "@/types/Book";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/services/mockApi";

interface Selection {
  bookId: string | null;
  chapterId: string | null;
  pageId: string | null;
}

export function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection>({
    bookId: null,
    chapterId: null,
    pageId: null,
  });

  const { data: books = [], isLoading: isLoadingBooks } = useQuery<BookType[]>({
    queryKey: ['books'],
    queryFn: () => mockApi.books.getAll().then(response => response.data || []),
  });

  const groupedBooks = books.reduce((acc: { [key: string]: GroupedBook }, book) => {
    const { description, title } = book;

    if (!description) return acc;

    if (!acc[description]) {
      acc[description] = {
        description,
        chapters: [],
        completedChapters: 0,
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

    return acc;
  }, {});

  const handlePageSelect = (pageId: string, verses: string[] = [], chapterId: string, bookDescription: string) => {
    setSelection({
      bookId: bookDescription,
      chapterId,
      pageId,
    });

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
          onNextPage: () => {
            if (currentPageIndex < currentChapter.pages.length - 1) {
              const nextPage = currentChapter.pages[currentPageIndex + 1];
              handlePageSelect(nextPage.id, nextPage.verses, chapterId, bookDescription);
            }
          },
          onPreviousPage: () => {
            if (currentPageIndex > 0) {
              const prevPage = currentChapter.pages[currentPageIndex - 1];
              handlePageSelect(prevPage.id, prevPage.verses, chapterId, bookDescription);
            }
          }
        } 
      });
      window.dispatchEvent(event);
    }
  };

  const getButtonClassName = (type: 'book' | 'chapter' | 'page', id: string) => {
    const isSelected = type === 'book' ? selection.bookId === id :
                      type === 'chapter' ? selection.chapterId === id :
                      selection.pageId === id;

    return `w-full justify-start text-sm ${
      isSelected ? 'bg-[#09090B] text-white hover:bg-[#09090B] hover:text-white' : ''
    }`;
  };

  const filteredBooks = Object.entries(groupedBooks).filter(([description]) => 
    description.toLowerCase().includes(searchQuery.toLowerCase())
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
                  filteredBooks.map(([description, book]) => (
                    <Collapsible
                      key={description}
                      open={expandedBook === description}
                      onOpenChange={() => setExpandedBook(expandedBook === description ? null : description)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className={getButtonClassName('book', description)}>
                          {expandedBook === description ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          )}
                          <Book className="h-4 w-4 mr-2" />
                          <span>{description}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {book.completedChapters}/{book.chapters.length}
                          </span>
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
                                  className={getButtonClassName('chapter', chapter.id)}
                                >
                                  {expandedChapter === chapter.id ? (
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                  )}
                                  {chapter.title}
                                  <span className="ml-auto text-xs text-muted-foreground">
                                    {chapter.completedPages || 0}/{chapter.pages.length}
                                  </span>
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="ml-6 space-y-1">
                                  {chapter.pages.map((page) => (
                                    <Button
                                      key={page.id}
                                      variant="ghost"
                                      className={getButtonClassName('page', page.id)}
                                      onClick={() => handlePageSelect(page.id, page.verses, chapter.id, description)}
                                    >
                                      Página {page.number}
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