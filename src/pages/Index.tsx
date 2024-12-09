import { useState } from "react";
import { CreateTask } from "@/components/CreateTask";
import { CreateGroupTask } from "@/components/CreateGroupTask";
import { TaskCard, Task } from "@/components/TaskCard";
import { useToast } from "@/components/ui/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupTask } from "@/types/GroupTask";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupTasks, setGroupTasks] = useState<GroupTask[]>([]);
  const { toast } = useToast();

  const handleCreateTask = (newTask: Omit<Task, "id" | "completed" | "inProgress" | "isPaused">) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      completed: false,
      inProgress: false,
      isPaused: false,
    };

    setTasks((prev) => [task, ...prev]);
    toast({
      title: "Task created",
      description: "Your new task has been created successfully.",
    });
  };

  const handleCreateGroupTask = (newTask: Omit<Task, "id" | "completed" | "inProgress"> & { assignedTo?: string[] }) => {
    const groupTask: GroupTask = {
      ...newTask,
      id: crypto.randomUUID(),
      completed: false,
      inProgress: false,
      isPaused: false,
      groupId: "mock-group-id",
      category: 'group'
    };

    setGroupTasks((prev) => [groupTask, ...prev]);
    toast({
      title: "Group task created",
      description: "Your new group task has been created successfully.",
    });
  };

  const handleUpdateTask = (updatedTask: Task | GroupTask) => {
    if ('groupId' in updatedTask) {
      setGroupTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } else {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, inProgress: false, isPaused: false }
          : task
      )
    );
    setGroupTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, inProgress: false, isPaused: false }
          : task
      )
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel 
            defaultSize={50} 
            minSize={30}
            className="overflow-auto bg-gradient-to-b from-background to-muted/20"
          >
            <div className="px-6 py-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                  <h1 className="text-4xl font-bold mb-2">Leituras Bíblicas</h1>
                  <p className="text-muted-foreground">
                    Organize suas leituras com datas e temporizadores
                  </p>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">Minhas Leituras</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal">
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
                  </TabsContent>
                  <TabsContent value="chat">
                    <div className="p-4 text-center text-muted-foreground">
                      Chat em breve...
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel 
            defaultSize={50} 
            minSize={30}
            className="overflow-auto"
          >
            <div className="h-full p-6">
              <div className="glass-card h-full rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Bíblia</h2>
                <p className="text-muted-foreground text-center mt-8">
                  Conteúdo bíblico em breve...
                </p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;