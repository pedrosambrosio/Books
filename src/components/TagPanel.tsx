import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon, Search } from "lucide-react";
import { TaskCard, Task } from "@/components/TaskCard";

interface TagPanelProps {
  tags: { name: string; count: number }[];
  tasks: Task[];
}

export const TagPanel = ({ tags, tasks }: TagPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredTasks = selectedTag
    ? tasks.filter(task => task.tags?.includes(selectedTag))
    : tasks;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Tags</h1>
        <p className="text-muted-foreground">
          Descubra e organize suas anotações por tags
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {tags
              .filter(tag => 
                tag.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((tag) => (
                <Badge
                  key={tag.name}
                  variant={selectedTag === tag.name ? "default" : "secondary"}
                  className="cursor-pointer px-3 py-1 hover:bg-accent"
                  onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                  <span className="ml-1 text-xs">({tag.count})</span>
                </Badge>
              ))}
          </div>

          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={() => {}}
                onComplete={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};