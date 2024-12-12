import { Plus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useToast } from "@/components/ui/use-toast";

interface SidebarTagsProps {
  tags?: { name: string; count: number }[];
}

export function SidebarTags({ tags = [] }: SidebarTagsProps) {
  const { toast } = useToast();

  const handleCreateTag = (name: string) => {
    toast({
      title: "Tag criada",
      description: `Tag "${name}" foi criada com sucesso`,
    });
  };

  return (
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
  );
}