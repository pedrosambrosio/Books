import { Button } from "@/components/ui/button";
import { ListTodo, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "../TaskCard";

interface TaskHeaderProps {
  task: Task;
  onComplete: (id: string) => void;
  onOpenDetails: () => void;
}

export const TaskHeader = ({ task, onComplete, onOpenDetails }: TaskHeaderProps) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <button
        onClick={() => onComplete(task.id)}
        className="text-primary hover:text-primary/80 transition-colors"
      >
        {task.completed ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>
      <h3 className={cn(
        "font-medium flex items-center gap-2",
        task.completed && "line-through text-muted-foreground"
      )}>
        {task.title}
        {task.category && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {task.category}
          </span>
        )}
      </h3>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto"
        onClick={onOpenDetails}
      >
        <ListTodo className="h-4 w-4" />
      </Button>
    </div>
  );
};