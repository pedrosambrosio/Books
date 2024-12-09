import { Book, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TaskFolder } from "@/types/TaskFolder";
import { useState } from "react";

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
    <Sidebar className="w-[15%] min-w-[200px] border-r border-border/40 shadow-sm">
      <SidebarContent className="px-2 py-4">
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
            className="shrink-0"
          >
            <Book className="h-4 w-4" />
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-sm font-semibold text-muted-foreground mb-2">
            Livros da Bíblia
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredFolders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  <SidebarMenuButton className="w-full px-2 py-2 rounded-md hover:bg-muted transition-colors">
                    <Book className="h-4 w-4 mr-2" />
                    <span className="text-sm">{folder.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}