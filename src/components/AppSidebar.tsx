import { useState, useEffect } from "react";
import { Book, ChevronDown, ChevronRight, Plus, Tags } from "lucide-react";
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

export function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch books
  const { data: books = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ['books'],
    queryFn: () => api.books.getAll().then(response => response.data || []),
  });

  // Adjusted data structure to handle grouping
  const groupedBooks = books.reduce((acc: { [key: string]: GroupedBook }, book) => {
    const { description, title } = book;

    if (!description) return acc; // Skip books without a description

    // Initialize the group if it doesn't exist
    if (!acc[description]) {
      acc[description] = {
        description,
        chapters: [],
        completedChapters: 0, // Assuming default as 0 if not present
      };
    }

    // Add chapters to the grouped book (handle case where chapters may not exist)
    acc[description].chapters = [
      ...acc[description].chapters,
      ...(book.chapters || []).map(chapter => ({
        ...chapter,
        title: title || 'Untitled Book', // Fallback title
        pages: chapter.pages || [], // Ensure pages array exists
      })),
    ];

    // Update completed chapters count
    acc[description].completedChapters += book.completedChapters || 0;

    return acc;
  }, {});

  // Create book mutation
  const createBookMutation = useMutation({
    mutationFn: (title: string) => 
      api.books.create({ 
        title, 
        type: 'regular',
        description: 'New Book Group',
        chapters: [],
        completedChapters: 0
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Livro adicionado",
        description: "O livro foi adicionado com sucesso",
      });
    },
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: (name: string) => 
      api.tags.create({ name, color: '#3b82f6' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: "Tag criada",
        description: "A tag foi criada com sucesso",
      });
    },
  });

  // Fetch tags
  const { data: tags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => api.tags.getAll().then(response => response.data || []),
  });

  // Filter books based on search query
  const filteredBooks = Object.values(groupedBooks).filter(book => 
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle page selection
  const handlePageSelect = (pageId: string, verses: string[] = []) => {
    setSelectedPage(pageId);
    // Emit an event to update the content area
    const event = new CustomEvent('pageSelected', { 
      detail: { verses } 
    });
    window.dispatchEvent(event);
  };

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
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => createBookMutation.mutate("Novo Livro")}
              >
                <Plus className="h-4 w-4" />
              </Button>
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
                                  className="w-full justify-start text-sm"
                                >
                                  {expandedChapter === chapter.id ? (
                                    <ChevronDown className="h-4 w-4 mr-2" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 mr-2" />
                                  )}
                                  {chapter.title}
                                  <span className="ml-auto text-xs text-muted-foreground">
                                    {chapter.completedPages || 0}/{(chapter.pages || []).length}
                                  </span>
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="ml-6 space-y-1">
                                  {(chapter.pages || []).map((page) => (
                                    <Button
                                      key={page.id}
                                      variant="ghost"
                                      className={`w-full justify-start text-sm pl-8 ${
                                        page.completed ? "text-green-500" : ""
                                      }`}
                                      onClick={() => handlePageSelect(page.id, page.verses)}
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

          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-2">
              <SidebarGroupLabel>Tags</SidebarGroupLabel>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => createTagMutation.mutate("Nova Tag")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoadingTags ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Carregando tags...
                  </div>
                ) : (
                  tags.map((tag) => (
                    <SidebarMenuItem key={tag.id}>
                      <SidebarMenuButton
                        className="w-full px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                        onClick={() => {
                          toast({
                            title: "Tag selecionada",
                            description: `Mostrando itens com a tag "${tag.name}"`,
                          });
                        }}
                      >
                        <Tags className="h-4 w-4 mr-2" style={{ color: tag.color }} />
                        <span>{tag.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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