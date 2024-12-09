import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Book, Tag } from "lucide-react";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  inProgress?: boolean;
  verses?: string;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  isPaused?: boolean;
  category?: string;
  priority?: string;
  subtasks?: Subtask[];
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onComplete?: (taskId: string) => void;
}

export const TaskCard = ({ task, onUpdate, onComplete }: TaskCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const toggleTag = (tag: string) => {
    const currentTags = task.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onUpdate({ ...task, tags: newTags });
  };

  const previewDescription = task.description?.split('\n').slice(0, 2).join('\n');

  return (
    <>
      <div 
        className="glass-card rounded-lg p-6 hover-scale cursor-pointer"
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="flex flex-col gap-4">
          <h3 className="font-medium text-lg">{task.title}</h3>
          
          {task.verses && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Book className="h-4 w-4" />
              <span>Versículo {task.verses}</span>
            </div>
          )}

          {previewDescription && (
            <div 
              className="text-sm text-muted-foreground line-clamp-2"
              dangerouslySetInnerHTML={{ __html: previewDescription }}
            />
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            {task.verses && (
              <div className="flex items-center gap-2 text-sm">
                <Book className="h-4 w-4" />
                <span>Versículo {task.verses}</span>
              </div>
            )}
            
            {task.description && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Tags</h4>
                <div className="flex flex-wrap gap-3">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer px-3 py-1"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};