import { useState } from "react";
import { Book, ChevronDown, ChevronRight, Plus, Tag, Tags, Check } from "lucide-react";
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
import { Book as BookType, Tag as TagType } from "@/types/Book";

const MOCK_TAGS: TagType[] = [
  { id: "1", name: "Important", color: "#ef4444" },
  { id: "2", name: "Review", color: "#3b82f6" },
];

interface AppSidebarProps {
  currentBook: BookType;
  onPageSelect?: (pageNumber: number, chapterId: string) => void;
  noteCounts?: {
    bookNotes: number;
    chapterNotes: number;
    pageNotes: number;
  };
  tags?: { name: string; count: number }[];
  currentChapterId?: string;
}

export function AppSidebar({ 
  currentBook, 
  onPageSelect, 
  noteCounts, 
  tags = [],
  currentChapterId 
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateBook = (title: string, type: 'bible' | 'regular' = 'regular') => {
    toast({
      title: "Livro adicionado",
      description: `"${title}" foi adicionado à sua biblioteca`,
    });
  };

  const handleCreateTag = (name: string) => {
    toast({
      title: "Tag criada",
      description: `Tag "${name}" foi criada com sucesso`,
    });
  };

  const handlePageClick = (pageNumber: number, chapterId: string) => {
    if (onPageSelect) {
      onPageSelect(pageNumber, chapterId);
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
              <div className="flex items-center gap-2">
                {noteCounts && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {noteCounts.bookNotes} notas
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => handleCreateBook("Novo Livro")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
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
                        <Book className="h-4 w-4 mr-2" />
                        <span className={expandedBook === book.id ? "text-[#09090B]" : "text-[#71717A]"}>{book.title}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {noteCounts?.bookNotes}
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
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {noteCounts?.chapterNotes}
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
                                    className={`w-full justify-start text-sm pl-8 ${
                                      page.completed || currentChapterId === chapter.id && page.number === currentPage 
                                        ? "text-[#09090B]" 
                                        : "text-[#71717A]"
                                    }`}
                                    onClick={() => handlePageClick(page.number, chapter.id)}
                                  >
                                    <span className="flex items-center gap-2">
                                      Página {page.number}
                                      {page.completed && <Check className="h-4 w-4" />}
                                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
                                        {noteCounts?.pageNotes}
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
              <SidebarGroupLabel>Tags</SidebarGroupLabel>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => handleCreateTag("Nova Tag")}
              >
                <Plus className="h-4 w-4" />
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
