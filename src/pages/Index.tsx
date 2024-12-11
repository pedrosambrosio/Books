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
import { Star, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const totalPages = 10;
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const [navigationHandlers, setNavigationHandlers] = useState<{
    onNextPage: () => void;
    onPreviousPage: () => void;
  }>({
    onNextPage: () => {},
    onPreviousPage: () => {},
  });

  const queryClient = useQueryClient();

  const handleCreateTask = (newTask: Omit<Task, "id" | "completed" | "inProgress" | "isPaused">) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      completed: false,
      inProgress: false,
      isPaused: false,
    };

    setTasks((prev) => [task, ...prev]);
    
    // Update annotation count in the books data
    queryClient.setQueryData(['books'], (oldData: any) => {
      const books = oldData.data;
      const updatedBooks = books.map((book: any) => ({
        ...book,
        annotationCount: (book.annotationCount || 0) + 1,
        chapters: book.chapters.map((chapter: any) => {
          if (chapter.id === currentChapterId) {
            return {
              ...chapter,
              annotationCount: (chapter.annotationCount || 0) + 1,
              pages: chapter.pages.map((page: any) => {
                if (page.id === currentPageId) {
                  return {
                    ...page,
                    annotationCount: (page.annotationCount || 0) + 1,
                  };
                }
                return page;
              }),
            };
          }
          return chapter;
        }),
      }));
      return { data: updatedBooks };
    });

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
    
    // Update annotation count in the books data
    queryClient.setQueryData(['books'], (oldData: any) => {
      const books = oldData.data;
      const updatedBooks = books.map((book: any) => ({
        ...book,
        annotationCount: Math.max((book.annotationCount || 0) - 1, 0),
        chapters: book.chapters.map((chapter: any) => {
          if (chapter.id === currentChapterId) {
            return {
              ...chapter,
              annotationCount: Math.max((chapter.annotationCount || 0) - 1, 0),
              pages: chapter.pages.map((page: any) => {
                if (page.id === currentPageId) {
                  return {
                    ...page,
                    annotationCount: Math.max((page.annotationCount || 0) - 1, 0),
                  };
                }
                return page;
              }),
            };
          }
          return chapter;
        }),
      }));
      return { data: updatedBooks };
    });

    toast({
      title: "Anotação excluída",
      description: "A anotação foi excluída com sucesso.",
    });
  };

  const handleCompletePage = () => {
    if (!currentPageId || !currentChapterId) return;

    queryClient.setQueryData(['books'], (oldData: any) => {
      const books = oldData.data;
      const updatedBooks = books.map((book: any) => {
        const updatedChapters = book.chapters.map((chapter: any) => {
          if (chapter.id === currentChapterId) {
            const updatedPages = chapter.pages.map((page: any) => {
              if (page.id === currentPageId) {
                return { ...page, completed: true };
              }
              return page;
            });
            
            const completedPages = updatedPages.filter((page: any) => page.completed).length;
            return {
              ...chapter,
              pages: updatedPages,
              completedPages,
            };
          }
          return chapter;
        });

        const completedChapters = updatedChapters.filter(
          (chapter: any) => chapter.completedPages === chapter.pages.length
        ).length;

        return {
          ...book,
          chapters: updatedChapters,
          completedChapters,
        };
      });

      return { data: updatedBooks };
    });

    toast({
      title: "Página concluída",
      description: "A página foi marcada como concluída com sucesso.",
    });
  };

  useEffect(() => {
    const handlePageSelected = (event: CustomEvent<{
      verses: string[];
      currentPage: number;
      totalPages: number;
      chapterId: string;
      pageId: string;
      onNextPage: () => void;
      onPreviousPage: () => void;
    }>) => {
      setSelectedVerses(event.detail.verses || []);
      setCurrentPage(event.detail.currentPage);
      setCurrentChapterId(event.detail.chapterId);
      setCurrentPageId(event.detail.pageId);
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
              <div className="p-4 md:p-6 flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="glass-card h-full rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold">Conteúdo</h2>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={navigationHandlers.onPreviousPage}
                          disabled={currentPage === 1}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={navigationHandlers.onNextPage}
                          disabled={currentPage === totalPages}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-4"
                          onClick={handleCompletePage}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Concluir
                        </Button>
                      </div>
                    </div>
                    {selectedVerses.length > 0 ? (
                      <div className="space-y-4">
                        {selectedVerses.map((verse, index) => (
                          <p key={index} className="text-muted-foreground">
                            {verse}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center">
                        Selecione uma página para ver seu conteúdo
                      </p>
                    )}
                  </div>
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