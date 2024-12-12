import { useState } from "react";
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
import { Book as BookType } from "@/types/Book";
import { GENESIS_CONTENT } from "@/data/bibleContent";
import { cn } from "@/lib/utils";

// Create Bible book structure with Genesis and Exodus
const BIBLE_BOOK: BookType = {
  id: "bible",
  title: "Bíblia",
  type: "bible",
  chapters: [
    {
      id: "genesis",
      number: 1,
      title: "Genesis",
      pages: Array.from({ length: 3 }, (_, i) => ({
        id: `genesis-${i+1}`,
        number: i + 1,
        title: `Página ${i + 1}`,
        completed: false
      })),
      completedPages: 0,
    },
    {
      id: "exodus",
      number: 2,
      title: "Exodus",
      pages: Array.from({ length: 2 }, (_, i) => ({
        id: `exodus-${i+1}`,
        number: i + 1,
        title: `Página ${i + 1}`,
        completed: false
      })),
      completedPages: 0,
    }
  ],
  completedChapters: 0,
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [isBookCompleted, setIsBookCompleted] = useState(false);
  const [currentBibleBook, setCurrentBibleBook] = useState(BIBLE_BOOK);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<{ [key: string]: number }>({});

  const handleCreateTask = (newTask: Omit<Task, "id" | "completed" | "inProgress" | "isPaused">) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      completed: false,
      inProgress: false,
      isPaused: false,
      pageNumber: currentPage,
    };

    setTasks((prev) => [task, ...prev]);
    
    // Update tag counts when creating a task
    if (newTask.tags) {
      const newTagCounts = { ...tagCounts };
      newTask.tags.forEach(tag => {
        newTagCounts[tag] = (newTagCounts[tag] || 0) + 1;
      });
      setTagCounts(newTagCounts);
    }

    toast({
      title: "Anotação criada",
      description: "Sua nova anotação foi criada com sucesso.",
    });
  };

  const handleTagCreate = (tag: string) => {
    if (!allTags.includes(tag)) {
      setAllTags(prev => [...prev, tag]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    if (taskToDelete?.tags) {
      const newTagCounts = { ...tagCounts };
      const remainingTasks = tasks.filter(task => task.id !== taskId);
      
      // Recalculate tag counts for all remaining tasks
      Object.keys(newTagCounts).forEach(tag => {
        const count = remainingTasks.filter(task => task.tags?.includes(tag)).length;
        if (count === 0) {
          delete newTagCounts[tag]; // Remove tag if no tasks use it
        } else {
          newTagCounts[tag] = count;
        }
      });
      
      setTagCounts(newTagCounts);
    }
    
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({
      title: "Anotação excluída",
      description: "A anotação foi excluída com sucesso.",
    });
  };

  const getNoteCounts = () => {
    const bookNotes = tasks.length;
    const chapterNotes = tasks.filter(task => 
      task.pageNumber && task.pageNumber >= 1 && task.pageNumber <= 3
    ).length;
    const pageNotes = tasks.filter(task => task.pageNumber === currentPage).length;

    return {
      bookNotes,
      chapterNotes,
      pageNotes
    };
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const oldTags = tasks.find(task => task.id === updatedTask.id)?.tags || [];
    const newTags = updatedTask.tags || [];
    
    // Find removed tags
    const removedTags = oldTags.filter(tag => !newTags.includes(tag));
    
    // Update tag counts for removed tags
    removedTags.forEach(tag => {
      const currentCount = tagCounts[tag] || 0;
      if (currentCount > 0) {
        setTagCounts(prev => ({
          ...prev,
          [tag]: prev[tag] - 1
        }));
      }
    });
    
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );

    // Update tag counts after task update
    const newTagCounts: { [key: string]: number } = {};
    tasks.forEach(task => {
      if (task.tags) {
        task.tags.forEach(tag => {
          newTagCounts[tag] = (newTagCounts[tag] || 0) + 1;
        });
      }
    });
    setTagCounts(newTagCounts);
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const currentChapter = currentBibleBook.chapters[0];
    if (currentChapter && currentChapter.pages[pageNumber - 1]) {
      setIsBookCompleted(currentChapter.pages[pageNumber - 1].completed);
    }
  };

  const getCurrentPageContent = () => {
    const content = GENESIS_CONTENT[currentPage - 1];
    if (!content) {
      return "Conteúdo não disponível";
    }
    return content;
  };

  const handleMarkAsCompleted = () => {
    const updatedBook = { ...currentBibleBook };
    const currentChapter = updatedBook.chapters[0];
    
    if (currentChapter && currentChapter.pages[currentPage - 1]) {
      currentChapter.pages[currentPage - 1].completed = !currentChapter.pages[currentPage - 1].completed;
      currentChapter.completedPages = currentChapter.pages.filter(page => page.completed).length;
    }
    
    updatedBook.completedChapters = updatedBook.chapters.filter(
      chapter => chapter.completedPages === chapter.pages.length
    ).length;
    
    setCurrentBibleBook(updatedBook);
    setIsBookCompleted(currentChapter.pages[currentPage - 1].completed);
    
    toast({
      title: currentChapter.pages[currentPage - 1].completed ? "Página marcada como concluída" : "Página marcada como pendente",
      description: `A página foi marcada como ${currentChapter.pages[currentPage - 1].completed ? "concluída" : "pendente"}.`,
    });
  };

  // Transform tagCounts into the format expected by AppSidebar
  const sidebarTags = Object.entries(tagCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count
    }));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-b from-background to-muted/20">
        <AppSidebar 
          currentBook={currentBibleBook} 
          onPageSelect={handlePageSelect}
          noteCounts={getNoteCounts()}
          tags={sidebarTags}
        />
        <ResizablePanelGroup 
          direction={isMobile ? "vertical" : "horizontal"} 
          className="h-screen flex-1"
        >
          <ResizablePanel defaultSize={50} minSize={30} className="h-full">
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
                        <CreateTask 
                          onCreateTask={handleCreateTask} 
                          existingTags={allTags}
                          onTagCreate={handleTagCreate}
                        />
                        
                        <div className="space-y-4">
                          {tasks
                            .filter(task => task.pageNumber === currentPage)
                            .map((task) => (
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
                      <h2 className="text-2xl font-semibold">Gênesis</h2>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handlePreviousPage}
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
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleMarkAsCompleted}
                          className={cn(
                            "transition-colors",
                            isBookCompleted 
                              ? "text-[#09090B]" 
                              : "text-[#71717A]"
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none whitespace-pre-line">
                      {getCurrentPageContent()}
                    </div>
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
