import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskTimer } from "./TaskTimer";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Circle, Timer, Pause, Play, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  completed: boolean;
  inProgress: boolean;
  isPaused?: boolean;
  priority?: "urgent" | "moderate" | "low";
  category?: string;
  subtasks?: Subtask[];
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onComplete: (id: string) => void;
}

export const TaskCard = ({ task, onUpdate, onComplete }: TaskCardProps) => {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
    if (task.inProgress && !task.isPaused) {
      onUpdate({ ...task, isPaused: true });
    } else {
      onUpdate({ ...task, inProgress: true, isPaused: false, startDate: task.inProgress ? task.startDate : new Date() });
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdate({ ...task, subtasks: updatedSubtasks });
  };

  const calculatePriority = () => {
    if (!task.endDate) return "low";
    const daysUntilDue = Math.ceil((task.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 2) return "urgent";
    if (daysUntilDue <= 5) return "moderate";
    return "low";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-500";
      case "moderate": return "text-yellow-500";
      default: return "text-green-500";
    }
  };

  const getSubtasksProgress = () => {
    if (!task.subtasks?.length) return "";
    const completed = task.subtasks.filter(st => st.completed).length;
    return `${completed}/${task.subtasks.length} subtasks`;
  };

  return (
    <>
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
                "font-medium flex items-center gap-2",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
                {task.category && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {task.category}
                  </span>
                )}
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  getPriorityColor(task.priority || calculatePriority())
                )}>
                  {task.priority || calculatePriority()}
                </span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setIsDetailsOpen(true)}
              >
                <ListTodo className="h-4 w-4" />
              </Button>
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
                  task.inProgress && !task.isPaused && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={toggleProgress}
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
            )}
            </div>
            {task.inProgress && task.startDate && (
              <div className="ml-7 mt-2">
                <TaskTimer startDate={task.startDate} isPaused={task.isPaused || false} />
              </div>
            )}
            {task.subtasks?.length > 0 && (
              <div className="ml-7 mt-2 text-sm text-muted-foreground">
                {getSubtasksProgress()}
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
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Subtasks</h4>
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Checkbox
                      id={subtask.id}
                      checked={subtask.completed}
                      onCheckedChange={() => toggleSubtask(subtask.id)}
                    />
                    <label
                      htmlFor={subtask.id}
                      className={cn(
                        "text-sm",
                        subtask.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {subtask.title}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
