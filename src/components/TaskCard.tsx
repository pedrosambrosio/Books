import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskHeader } from "./task/TaskHeader";
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
  completed: boolean;
  inProgress: boolean;
  isPaused?: boolean;
  startDate?: Date;
  endDate?: Date;
  category?: string;
  chapter?: string;
  verses?: string;
  notes?: string;
  tags?: string[];
  type?: "study" | "devotional" | "sermon" | "other";
  priority?: "urgent" | "moderate" | "low";
  subtasks?: Subtask[];
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onComplete: (id: string) => void;
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

  return (
    <>
      <div className={cn(
        "glass-card rounded-lg p-4 mb-4 hover-scale",
        task.completed && "opacity-75"
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <TaskHeader
              task={task}
              onComplete={onComplete}
              onOpenDetails={() => setIsDetailsOpen(true)}
            />
            
            {task.description && (
              <p className="text-sm text-muted-foreground ml-7 mb-3">
                {task.description}
              </p>
            )}

            {task.chapter && (
              <div className="ml-7 flex items-center gap-2 mb-2">
                <Book className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Capítulo {task.chapter}
                  {task.verses && `, Versículos ${task.verses}`}
                </span>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="ml-7 flex flex-wrap gap-2 mt-2">
                {task.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
            {task.notes && (
              <div className="space-y-2">
                <h4 className="font-medium">Anotações</h4>
                <p className="text-sm whitespace-pre-wrap">{task.notes}</p>
              </div>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
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