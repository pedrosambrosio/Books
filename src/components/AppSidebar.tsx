import { useState } from "react";
import { Book, ChevronLeft } from "lucide-react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <Sidebar variant="inset" className={isCollapsed ? "w-16" : "w-[15%]"}>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          {!isCollapsed && (
            <>
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
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="shrink-0 ml-auto"
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Livros da Bíblia</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredFolders.map((folder) => (
                  <SidebarMenuItem key={folder.id}>
                    <SidebarMenuButton>
                      <Book className="h-4 w-4" />
                      <span>{folder.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {isCollapsed && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCreateFolder}
              title="Adicionar livro"
            >
              <Book className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}