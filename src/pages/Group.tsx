import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateGroupTask } from "@/components/CreateGroupTask";
import { TaskCard } from "@/components/TaskCard";
import { Group, GroupTask } from "@/types/GroupTask";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with actual data fetching
const mockGroup: Group = {
  id: "group-1",
  name: "Physics Study Group",
  description: "A group for studying physics together",
  members: [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ],
  inviteCode: "PHY123"
};

export default function GroupPage() {
  const { groupId } = useParams();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<GroupTask[]>([]);

  const handleCreateTask = (newTask: Omit<GroupTask, "id" | "completed" | "inProgress"> & { assignedTo?: string[] }) => {
    const task: GroupTask = {
      ...newTask,
      id: crypto.randomUUID(),
      completed: false,
      inProgress: false,
      isPaused: false,
      groupId: mockGroup.id,
      category: "group"
    };

    setTasks((prev) => [task, ...prev]);
    toast({
      title: "Task created",
      description: "Your new group task has been created successfully.",
    });
  };

  const handleUpdateTask = (updatedTask: GroupTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, inProgress: false, isPaused: false }
          : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{mockGroup.name}</h1>
          <p className="text-muted-foreground">{mockGroup.description}</p>
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm font-medium">Invite Code: {mockGroup.inviteCode}</p>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <CreateGroupTask
              groupId={mockGroup.id}
              members={mockGroup.members}
              onCreateTask={handleCreateTask}
            />
            
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onComplete={handleCompleteTask}
              />
            ))}
          </TabsContent>

          <TabsContent value="chat">
            <div className="p-4 text-center text-muted-foreground">
              Chat functionality coming soon...
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="p-4 text-center text-muted-foreground">
              File sharing functionality coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}