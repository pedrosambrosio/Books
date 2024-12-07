import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Task } from "./TaskCard";

interface CreateTaskProps {
  onCreateTask: (task: Omit<Task, "id" | "completed" | "inProgress">) => void;
}

export const CreateTask = ({ onCreateTask }: CreateTaskProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
    });

    setTitle("");
    setDescription("");
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Plus className="h-5 w-5 text-primary" />
        <Input
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!isExpanded && e.target.value) setIsExpanded(true);
          }}
          className="border-none bg-transparent px-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
        />
      </div>
      {isExpanded && (
        <>
          <Textarea
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] mt-2 mb-4 resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsExpanded(false);
                setTitle("");
                setDescription("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </>
      )}
    </form>
  );
};