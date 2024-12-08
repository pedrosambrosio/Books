import { useState } from "react";
import { Folder, FolderPlus, Search } from "lucide-react";
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

export function AppSidebar() {
  const [folders, setFolders] = useState<TaskFolder[]>([
    { id: "default", name: "All Tasks", tasks: [] },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleCreateFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      const newFolder: TaskFolder = {
        id: crypto.randomUUID(),
        name: folderName,
        tasks: [],
      };
      setFolders([...folders, newFolder]);
      toast({
        title: "Folder created",
        description: `Created folder "${folderName}"`,
      });
    }
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <SidebarInput
            type="text"
            placeholder="Search folders..."
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
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredFolders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  <SidebarMenuButton>
                    <Folder className="h-4 w-4" />
                    <span>{folder.name}</span>
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