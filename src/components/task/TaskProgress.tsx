import { Button } from "@/components/ui/button";
import { Timer, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskTimer } from "../TaskTimer";
import { Task } from "../TaskCard";

interface TaskProgressProps {
  task: Task;
  onToggleProgress: () => void;
}

export const TaskProgress = ({ task, onToggleProgress }: TaskProgressProps) => {
  if (!task.startDate || task.completed) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8",
          task.inProgress && !task.isPaused && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        onClick={onToggleProgress}
      >
        {task.inProgress ? (
          task.isPaused ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          )
        ) : (
          <>
            <Timer className="h-4 w-4 mr-2" />
            Start
          </>
        )}
      </Button>
      {task.inProgress && task.startDate && (
        <div className="mt-2">
          <TaskTimer startDate={task.startDate} isPaused={task.isPaused || false} />
        </div>
      )}
    </>
  );
};