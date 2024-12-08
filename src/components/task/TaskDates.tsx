import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "../TaskCard";

interface TaskDatesProps {
  task: Task;
  onUpdateDates: (startDate?: Date, endDate?: Date) => void;
}

export const TaskDates = ({ task, onUpdateDates }: TaskDatesProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Popover>
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
            onSelect={(date) => onUpdateDates(date, task.endDate)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
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
            onSelect={(date) => onUpdateDates(task.startDate, date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};