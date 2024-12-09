import { useState } from "react";
import { CreateTask } from "@/components/CreateTask";
import { TaskCard, Task } from "@/components/TaskCard";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const handleUpdateTask = (updatedTask: Task) => {
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-background to-muted/20">
        <AppSidebar />
        <ResizablePanelGroup 
          direction={isMobile ? "vertical" : "horizontal"} 
          className="flex-1"
        >
          <ResizablePanel 
            defaultSize={50} 
            minSize={30}
            className="min-h-[300px]"
          >
            <ScrollArea className="h-full">
              <div className="p-4 pl-12 md:p-8 md:pl-16">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Leituras Bíblicas</h1>
                    <p className="text-muted-foreground">
                      Organize suas leituras com datas e temporizadores
                    </p>
                  </div>

                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-auto">
                      <TabsTrigger 
                        value="personal"
                        className="data-[state=active]:bg-white data-[state=active]:text-black px-4 py-2"
                      >
                        Minhas Leituras
                      </TabsTrigger>
                      <TabsTrigger 
                        value="chat"
                        className="data-[state=active]:bg-white data-[state=active]:text-black px-4 py-2"
                      >
                        Chat
                      </TabsTrigger>
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
            </ScrollArea>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30} className="min-h-[300px]">
            <ScrollArea className="h-full">
              <div className="p-4 md:p-8">
                <div className="glass-card h-full rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">Bíblia</h2>
                  <p className="text-muted-foreground text-center mt-8">
                    Conteúdo bíblico em breve...
                  </p>
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SidebarProvider>
  );
};

export default Index;