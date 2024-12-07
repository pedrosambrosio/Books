import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TaskTimer } from "./TaskTimer";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Circle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  completed: boolean;
  inProgress: boolean;
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onComplete: (id: string) => void;
}

export const TaskCard = ({ task, onUpdate, onComplete }: TaskCardProps) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const handleStartDate = (date: Date | undefined) => {
    onUpdate({ ...task, startDate: date });
    setIsStartOpen(false);
  };

  const handleEndDate = (date: Date | undefined) => {
    onUpdate({ ...task, endDate: date });
    setIsEndOpen(false);
  };

  const toggleProgress = () => {
    if (!task.startDate) return;
    onUpdate({ ...task, inProgress: !task.inProgress });
  };

  return (
    <div className={cn(
      "glass-card rounded-lg p-4 mb-4 hover-scale",
      task.completed && "opacity-75"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
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
              "font-medium",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground ml-7 mb-3">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-3 ml-7">
            <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "text-sm h-8",
                    task.startDate && "text-primary"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {task.startDate ? format(task.startDate, "PPP") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={task.startDate}
                  onSelect={handleStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "text-sm h-8",
                    task.endDate && "text-primary"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {task.endDate ? format(task.endDate, "PPP") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={task.endDate}
                  onSelect={handleEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {task.startDate && !task.completed && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8",
                  task.inProgress && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={toggleProgress}
              >
                <Timer className="h-4 w-4 mr-2" />
                {task.inProgress ? "Stop" : "Start"}
              </Button>
            )}
          </div>
          {task.inProgress && task.startDate && (
            <div className="ml-7 mt-2">
              <TaskTimer startDate={task.startDate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};