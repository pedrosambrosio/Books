import { useState } from "react";
import { CreateTask } from "@/components/CreateTask";
import { TaskCard, Task } from "@/components/TaskCard";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const handleCreateTask = (newTask: Omit<Task, "id" | "completed" | "inProgress">) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      completed: false,
      inProgress: false,
    };

    setTasks((prev) => [task, ...prev]);
    toast({
      title: "Task created",
      description: "Your new task has been created successfully.",
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, inProgress: false }
          : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">
            Organize your tasks with dates and timers
          </p>
        </div>

        <div className="space-y-4">
          <CreateTask onCreateTask={handleCreateTask} />
          
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="animate-fade-in">
                <TaskCard
                  task={task}
                  onUpdate={handleUpdateTask}
                  onComplete={handleCompleteTask}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;