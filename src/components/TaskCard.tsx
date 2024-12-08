import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { TaskHeader } from "./task/TaskHeader";
import { TaskDates } from "./task/TaskDates";
import { TaskProgress } from "./task/TaskProgress";

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDates = (startDate?: Date, endDate?: Date) => {
    onUpdate({ ...task, startDate, endDate });
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

            <div className="ml-7">
              <TaskDates task={task} onUpdateDates={handleDates} />
              <TaskProgress task={task} onToggleProgress={toggleProgress} />
            </div>
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