import { useState, useEffect } from "react";
import { CreateTask } from "@/components/CreateTask";
import { TaskCard, Task } from "@/components/TaskCard";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Star } from "lucide-react";
import { ContentPanel } from "@/components/content/ContentPanel";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const [isPageCompleted, setIsPageCompleted] = useState(false);
  const [navigationHandlers, setNavigationHandlers] = useState<{
    onNextPage: () => void;
    onPreviousPage: () => void;
  }>({
    onNextPage: () => {},
    onPreviousPage: () => {},
  });

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

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({
      title: "Anotação excluída",
      description: "A anotação foi excluída com sucesso.",
    });
  };

  useEffect(() => {
    const handlePageSelected = (event: CustomEvent<{
      verses: string[];
      currentPage: number;
      totalPages: number;
      onNextPage: () => void;
      onPreviousPage: () => void;
      isCompleted?: boolean;
    }>) => {
      setSelectedVerses(event.detail.verses || []);
      setCurrentPage(event.detail.currentPage);
      setIsPageCompleted(event.detail.isCompleted || false);
      setNavigationHandlers({
        onNextPage: event.detail.onNextPage,
        onPreviousPage: event.detail.onPreviousPage,
      });
    };

    window.addEventListener('pageSelected', handlePageSelected as EventListener);

    return () => {
      window.removeEventListener('pageSelected', handlePageSelected as EventListener);
    };
  }, []);

  const handlePageComplete = () => {
    setIsPageCompleted(!isPageCompleted);
    // Dispatch event to update sidebar
    const event = new CustomEvent('pageCompleted', {
      detail: {
        currentPage,
        completed: !isPageCompleted
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-b from-background to-muted/20">
        <AppSidebar />
        <ResizablePanelGroup 
          direction={isMobile ? "vertical" : "horizontal"} 
          className="h-screen flex-1"
        >
          <ResizablePanel 
            defaultSize={50} 
            minSize={30}
            className="h-full"
          >
            <ScrollArea className="h-full">
              <div className="p-4 md:p-6 flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="text-center animate-fade-in mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Anote ou Pesquise..</h1>
                    <p className="text-muted-foreground">
                      Organize seu estudo e aprendizado
                    </p>
                  </div>

                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-auto mb-6">
                      <TabsTrigger 
                        value="personal"
                        className="data-[state=active]:bg-white data-[state=active]:text-black px-6 py-3"
                      >
                        Minhas Notas
                      </TabsTrigger>
                      <TabsTrigger 
                        value="chat"
                        className="data-[state=active]:bg-white data-[state=active]:text-black px-6 py-3 flex items-center gap-2"
                      >
                        Chat <Star className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal">
                      <div className="space-y-6">
                        <CreateTask onCreateTask={handleCreateTask} />
                        
                        <div className="space-y-4">
                          {tasks.map((task) => (
                            <div key={task.id} className="animate-fade-in">
                              <TaskCard
                                task={task}
                                onUpdate={handleUpdateTask}
                                onComplete={handleCompleteTask}
                                onDelete={handleDeleteTask}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="chat">
                      <div className="p-6 text-center text-muted-foreground">
                        Chat em breve...
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30} className="h-full">
            <ScrollArea className="h-full">
              <div className="p-4 md:p-6">
                <div className="max-w-2xl mx-auto">
                  <ContentPanel
                    verses={selectedVerses}
                    currentPage={currentPage}
                    totalPages={10}
                    onNextPage={navigationHandlers.onNextPage}
                    onPreviousPage={navigationHandlers.onPreviousPage}
                    onComplete={handlePageComplete}
                    isCompleted={isPageCompleted}
                  />
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
