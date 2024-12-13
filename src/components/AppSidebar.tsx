import { useState } from "react";
import { Book, ChevronDown, ChevronRight, Tag, Tags, Check, Search } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Book as BookType } from "@/types/Book";
import { QuizResult } from "@/types/Quiz";
import { LevelIcon } from "@/components/quiz/LevelIcon";

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
  onViewChange?: (view: 'books' | 'tags') => void;
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
  const { toast } = useToast();

  const handlePageClick = (pageNumber: number) => {
    if (onPageSelect) {
      onPageSelect(pageNumber);
      toast({
        title: "Página selecionada",
        description: `Navegando para a página ${pageNumber}`,
      });
    }
  };

  // Filter books based on search query
  const filteredBooks = [currentBook].filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="w-[var(--sidebar-width)] min-w-[200px] border-r border-border">
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-2rem)]">
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-2">
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => onViewChange?.('books')}
              >
                <SidebarGroupLabel className="cursor-pointer hover:text-primary transition-colors">
                  Livros
                </SidebarGroupLabel>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => {
                  toast({
                    title: "Buscar livros",
                    description: "Funcionalidade de busca em desenvolvimento.",
                  });
                }}
              >
                <Search className="h-4 w-4" />
              </Button>
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
                          <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        <span className={expandedBook === book.id ? "text-[#09090B]" : "text-[#71717A]"}>{book.title}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            notas {noteCounts?.bookNotes || 0}
                          </span>
                          <span className="text-xs text-muted-foreground">
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
                              >
                                {expandedChapter === chapter.id ? (
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 mr-2" />
                                )}
                                <span className={expandedChapter === chapter.id ? "text-[#09090B]" : "text-[#71717A]"}>{chapter.title || `Capítulo ${chapter.number}`}</span>
                                <div className="ml-auto flex items-center gap-2">
                                  {chapterLevels[chapter.id] && (
                                    <LevelIcon level={chapterLevels[chapter.id].level} />
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    notas {noteCounts?.chapterNotes || 0}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
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
                                      {page.completed && <Check className="h-4 w-4" />}
                                      <span className="text-xs text-muted-foreground ml-auto">
                                        notas {noteCounts?.pageNotes || 0}
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
            <div className="flex items-center justify-between px-4 py-2">
              <Button
                variant="ghost"
                className="p-0 h-auto hover:bg-transparent"
                onClick={() => onViewChange?.('tags')}
              >
                <SidebarGroupLabel className="cursor-pointer hover:text-primary transition-colors">
                  Tags
                </SidebarGroupLabel>
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {tags
                  .filter(tag => tag.count > 0)
                  .map((tag) => (
                    <SidebarMenuItem key={tag.name}>
                      <SidebarMenuButton
                        className="w-full px-4 py-2 hover:bg-accent rounded-lg transition-colors flex items-center justify-between"
                        onClick={() => {
                          toast({
                            title: "Tag selecionada",
                            description: `Mostrando itens com a tag "${tag.name}"`,
                          });
                        }}
                      >
                        <div className="flex items-center">
                          <Tags className="h-4 w-4 mr-2" />
                          <span>{tag.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {tag.count}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}