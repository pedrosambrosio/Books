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
  useSidebar,
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
  const { state, setOpen } = useSidebar();
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

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar variant="floating" className={isCollapsed ? "w-16" : ""}>
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
            onClick={() => setOpen(!isCollapsed)}
            className={`shrink-0 ${isCollapsed ? 'mx-auto' : 'ml-auto'}`}
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
      </SidebarContent>
    </Sidebar>
  );
}