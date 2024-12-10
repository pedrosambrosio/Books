import { useState } from "react";
import { Book, ChevronDown, ChevronRight, Plus, Tag, Tags } from "lucide-react";
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
import { BIBLE_BOOKS, BIBLE_CHAPTERS } from "@/data/bible";

// Mock data for testing - replace with actual data from your backend
const MOCK_BOOKS: BookType[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    type: "regular",
    chapters: [
      {
        id: "c1",
        number: 1,
        title: "Chapter One",
        pages: [
          { id: "p1", number: 1 },
          { id: "p2", number: 2 },
        ],
      },
    ],
  },
];

const MOCK_TAGS: TagType[] = [
  { id: "1", name: "Important", color: "#ef4444" },
  { id: "2", name: "Review", color: "#3b82f6" },
];

// Create Bible book structure
const BIBLE_BOOK: BookType = {
  id: "bible",
  title: "Bíblia",
  type: "bible",
  chapters: BIBLE_BOOKS.map(book => ({
    id: book,
    number: BIBLE_BOOKS.indexOf(book) + 1,
    title: book,
    pages: Array.from({ length: BIBLE_CHAPTERS[book] || 0 }, (_, i) => ({
      id: `${book}-${i+1}`,
      number: i + 1,
      title: `Capítulo ${i + 1}`
    })),
  })),
};

export function AppSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCreateBook = (title: string, type: 'bible' | 'regular' = 'regular') => {
    // Here you would typically make an API call to create a new book
    toast({
      title: "Book added",
      description: `Added "${title}" to your library`,
    });
  };

  const handleCreateTag = (name: string) => {
    // Here you would typically make an API call to create a new tag
    toast({
      title: "Tag created",
      description: `Created tag "${name}"`,
    });
  };

  // Filter books based on search query
  const filteredBooks = [...MOCK_BOOKS, BIBLE_BOOK].filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="w-[var(--sidebar-width)] min-w-[200px] border-r border-border">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <SidebarInput
            type="text"
            placeholder="Search books..."
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
              <SidebarGroupLabel>Books</SidebarGroupLabel>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => handleCreateBook("New Book")}
              >
                <Plus className="h-4 w-4" />
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
                        <Book className="h-4 w-4 mr-2" />
                        <span>{book.title}</span>
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
                                {chapter.title || `${book.type === 'bible' ? chapter.title : 'Section'} ${chapter.number}`}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="ml-6 space-y-1">
                                {chapter.pages.map((page) => (
                                  <Button
                                    key={page.id}
                                    variant="ghost"
                                    className="w-full justify-start text-sm pl-8"
                                    onClick={() => {
                                      // Handle page navigation
                                      toast({
                                        title: "Capítulo selecionado",
                                        description: `Navegando para o capítulo ${page.number}`,
                                      });
                                    }}
                                  >
                                    Capítulo {page.number}
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
                onClick={() => handleCreateTag("New Tag")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {MOCK_TAGS.map((tag) => (
                  <SidebarMenuItem key={tag.id}>
                    <SidebarMenuButton
                      className="w-full px-4 py-2 hover:bg-accent rounded-lg transition-colors"
                      onClick={() => {
                        // Handle tag selection
                        toast({
                          title: "Tag selected",
                          description: `Showing items tagged with "${tag.name}"`,
                        });
                      }}
                    >
                      <Tags className="h-4 w-4 mr-2" style={{ color: tag.color }} />
                      <span>{tag.name}</span>
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