import { TaskCard, Task } from "@/components/TaskCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TagPanelProps {
  tags: { name: string; count: number }[];
  tasks: Task[];
}

export function TagPanel({ tags, tasks }: TagPanelProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold">Tags</h2>
          <p className="text-muted-foreground">
            Organize e gerencie suas anotações por tags
          </p>
          <Input type="search" placeholder="Buscar por tag..." className="max-w-md mx-auto" />
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="cursor-pointer">
              Tudo
            </Badge>
            {tags.map((tag) => (
              <Badge key={tag.name} variant="secondary" className="cursor-pointer">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={() => {}}
                onComplete={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}