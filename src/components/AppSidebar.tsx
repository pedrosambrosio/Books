import { useState } from "react";
import { Book } from "lucide-react";
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
import { TaskFolder } from "@/types/TaskFolder";
import { ScrollArea } from "@/components/ui/scroll-area";

const BIBLE_BOOKS = [
  "Gênesis",
  "Êxodo",
  "Levítico",
  "Números",
  "Deuteronômio",
  "Salmos",
  "Provérbios",
  "Mateus",
  "Marcos",
  "Lucas",
  "João",
  "Atos",
  "Romanos",
];

export function AppSidebar() {
  const [folders, setFolders] = useState<TaskFolder[]>([
    { id: "default", name: "Todas as Leituras", tasks: [] },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleCreateFolder = () => {
    const selectedBook = prompt("Selecione um livro da Bíblia:\n" + BIBLE_BOOKS.join(", "));
    if (selectedBook && BIBLE_BOOKS.includes(selectedBook)) {
      const newFolder: TaskFolder = {
        id: crypto.randomUUID(),
        name: selectedBook,
        tasks: [],
        bibleBook: selectedBook,
      };
      setFolders([...folders, newFolder]);
      toast({
        title: "Livro adicionado",
        description: `Adicionado "${selectedBook}" à sua lista de leituras`,
      });
    }
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="w-[15%] min-w-[200px] border-r border-border">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-4">
          <SidebarInput
            type="text"
            placeholder="Buscar livros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCreateFolder}
            className="shrink-0 touch-manipulation"
          >
            <Book className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2">Livros da Bíblia</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredFolders.map((folder) => (
                  <SidebarMenuItem key={folder.id}>
                    <SidebarMenuButton className="w-full px-4 py-2 hover:bg-accent rounded-lg transition-colors">
                      <Book className="h-4 w-4 mr-2" />
                      <span>{folder.name}</span>
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