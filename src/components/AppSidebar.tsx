import { useState } from "react";
import { Book, ChevronDown, ChevronRight, Plus, Tags, Check, Star } from "lucide-react";
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
import { SidebarChapter } from "./sidebar/SidebarChapter";
import { SidebarTags } from "./sidebar/SidebarTags";

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
  currentPage?: number;
}

export function AppSidebar({ 
  currentBook, 
  onPageSelect, 
  noteCounts, 
  tags = [],
  currentChapterId,
  currentPage
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateBook = (title: string, type: 'bible' | 'regular' = 'regular') => {
    toast({
      title: "Livro adicionado",
      description: `"${title}" foi adicionado à sua biblioteca`,
    });
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
                        <span className={expandedBook === book.id ? "text-[#09090B]" : "text-[#71717A]"}>
                          {book.title}
                        </span>
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
                          <SidebarChapter
                            key={chapter.id}
                            chapter={chapter}
                            currentChapterId={currentChapterId}
                            currentPage={currentPage}
                            onPageSelect={onPageSelect}
                            noteCounts={noteCounts}
                          />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarTags tags={tags} />
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}