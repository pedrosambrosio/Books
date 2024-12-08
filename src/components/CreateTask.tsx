import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Task, Subtask } from "./TaskCard";

interface CreateTaskProps {
  onCreateTask: (task: Omit<Task, "id" | "completed" | "inProgress">) => void;
}

const PREDEFINED_CATEGORIES = [
  "Math",
  "History",
  "Physics",
  "Chemistry",
  "Literature",
  "Computer Science",
  "Other"
];

export const CreateTask = ({ onCreateTask }: CreateTaskProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subtasks, setSubtasks] = useState<Omit<Subtask, "id">[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { title: newSubtask.trim(), completed: false }]);
    setNewSubtask("");
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      category: category || undefined,
      subtasks: subtasks.map(st => ({
        ...st,
        id: crypto.randomUUID()
      }))
    });

    setTitle("");
    setDescription("");
    setCategory("");
    setSubtasks([]);
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
          
          <div className="mb-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium">Subtasks</h4>
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={subtask.title}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSubtask(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add a subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddSubtask}
                disabled={!newSubtask.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsExpanded(false);
                setTitle("");
                setDescription("");
                setCategory("");
                setSubtasks([]);
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