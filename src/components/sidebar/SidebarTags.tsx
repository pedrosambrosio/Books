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
import { useState } from "react";

interface SidebarTagsProps {
  tags?: { name: string; count: number }[];
  onUpdateTagCount?: (tagName: string, change: number) => void;
}

export function SidebarTags({ tags = [], onUpdateTagCount }: SidebarTagsProps) {
  const { toast } = useToast();
  const [lastSelectedTag, setLastSelectedTag] = useState<string | null>(null);

  // Filter out tags with zero count
  const activeTags = tags.filter(tag => tag.count > 0);

  const handleCreateTag = (name: string) => {
    if (!name.trim()) return;
    
    if (onUpdateTagCount) {
      onUpdateTagCount(name, 1);
    }

    toast({
      title: "Tag criada",
      description: `Tag "${name}" foi criada com sucesso.`,
    });
  };

  const handleTagClick = (tagName: string) => {
    // Only show toast if selecting a different tag
    if (lastSelectedTag !== tagName) {
      toast({
        title: "Tag selecionada",
        description: `Mostrando itens com a tag "${tagName}"`,
      });
      setLastSelectedTag(tagName);
    }
  };

  // Show empty state when no tags are available
  if (activeTags.length === 0) {
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
        <p className="px-4 py-2 text-sm text-muted-foreground">
          Nenhuma tag disponível.
        </p>
      </SidebarGroup>
    );
  }

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
          {activeTags.map((tag) => (
            <SidebarMenuItem key={tag.name}>
              <SidebarMenuButton
                className="w-full px-4 py-2 hover:bg-accent rounded-lg transition-colors flex items-center justify-between"
                onClick={() => handleTagClick(tag.name)}
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