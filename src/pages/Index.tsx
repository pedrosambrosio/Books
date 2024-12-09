import { useState } from "react";
import { CreateTask } from "@/components/CreateTask";
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
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col max-w-[2000px] mx-auto w-full">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel 
            defaultSize={50} 
            minSize={30}
            className="overflow-y-auto bg-gradient-to-b from-background to-muted/20"
          >
            <div className="px-8 py-8">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center animate-fade-in space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight">Leituras Bíblicas</h1>
                  <p className="text-muted-foreground text-lg">
                    Organize suas leituras com datas e temporizadores
                  </p>
                </div>

                <div className="glass-card rounded-lg border border-border/40 shadow-sm">
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 p-1 gap-1 bg-white">
                      <TabsTrigger 
                        value="personal"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-black"
                      >
                        Minhas Leituras
                      </TabsTrigger>
                      <TabsTrigger 
                        value="chat"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-black"
                      >
                        Chat
                      </TabsTrigger>
                    </TabsList>
                    <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                      <TabsContent value="personal" className="mt-0 space-y-6">
                        <CreateTask onCreateTask={handleCreateTask} />
                        <div className="space-y-4">
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
                      </TabsContent>
                      <TabsContent value="chat" className="mt-0">
                        <div className="p-4 text-center text-muted-foreground">
                          Chat em breve...
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-border/40 hover:bg-border transition-colors" />
          
          <ResizablePanel 
            defaultSize={50} 
            minSize={30}
            className="overflow-auto"
          >
            <div className="h-full p-8">
              <div className="glass-card h-full rounded-lg border border-border/40 shadow-sm p-6">
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