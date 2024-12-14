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
import { Star, ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Book as BookType } from "@/types/Book";
import { GENESIS_CONTENT } from "@/data/bibleContent";
import { cn } from "@/lib/utils";
import { QuizDialog } from "@/components/quiz/QuizDialog";
import { CHAPTER_QUIZZES } from "@/data/quizQuestions";
import { QuizResult } from "@/types/Quiz";
import { ContentViewer } from "@/components/ContentViewer";
import { TagPanel } from "@/components/TagPanel";
import { LibraryPanel } from "@/components/LibraryPanel";
import { MobileHeader } from "@/components/mobile/MobileHeader";

// Update the ViewType definition to include 'chat'
type ViewType = 'books' | 'tags' | 'library' | 'chat';
type TabType = 'personal' | 'chat';

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
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [chapterLevels, setChapterLevels] = useState<{ [chapterId: string]: QuizResult }>({});
  const [isCreatingNoteFromSelection, setIsCreatingNoteFromSelection] = useState(false);
  const [selectedTextReference, setSelectedTextReference] = useState("");
  const [currentView, setCurrentView] = useState<ViewType>('books');
  const [currentTab, setCurrentTab] = useState<TabType>('personal');

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
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      
      // Update the book data structure to reflect the current page's completion status
      const updatedBook = { ...currentBibleBook };
      const currentChapter = updatedBook.chapters[0];
      if (currentChapter && currentChapter.pages[nextPage - 1]) {
        setIsBookCompleted(currentChapter.pages[nextPage - 1].completed);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      
      // Update the book data structure to reflect the current page's completion status
      const updatedBook = { ...currentBibleBook };
      const currentChapter = updatedBook.chapters[0];
      if (currentChapter && currentChapter.pages[prevPage - 1]) {
        setIsBookCompleted(currentChapter.pages[prevPage - 1].completed);
      }
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
      return [];
    }
    return content;
  };

  const handleMarkAsCompleted = () => {
    const updatedBook = { ...currentBibleBook };
    const currentChapter = updatedBook.chapters[0];
    
    if (currentChapter && currentChapter.pages[currentPage - 1]) {
      const wasCompletedBefore = currentChapter.pages[currentPage - 1].completed;
      currentChapter.pages[currentPage - 1].completed = !currentChapter.pages[currentPage - 1].completed;
      currentChapter.completedPages = currentChapter.pages.filter(page => page.completed).length;
      
      // If this is the last page and it wasn't completed before, open the quiz
      if (currentPage === totalPages && !wasCompletedBefore && currentChapter.pages[currentPage - 1].completed) {
        setIsQuizOpen(true);
      }
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

  const handleQuizComplete = (result: QuizResult) => {
    setChapterLevels(prev => ({
      ...prev,
      [result.chapterId]: result
    }));
    setIsQuizOpen(false);
    
    toast({
      title: "Quiz completado!",
      description: `Você acertou ${result.score} de ${result.totalQuestions} questões.`,
    });
  };

  const handleCreateNoteFromSelection = (selectedText: string) => {
    setSelectedTextReference(selectedText);
    setIsCreatingNoteFromSelection(true);
    // Scroll to the create note form
    document.querySelector('.create-task-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Transform tagCounts into the format expected by AppSidebar
  const sidebarTags = Object.entries(tagCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count
    }));

  const renderMobileBookPanel = () => {
    if (!isMobile || currentView !== 'books') return null;

    return (
      <div className="mobile-book-panel">
        <MobileHeader 
          currentTab={currentTab}
          onViewChange={setCurrentView}
        />
        <ScrollArea className="flex-1">
          <div className="p-2">
            <ContentViewer
              content={getCurrentPageContent()}
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              isCompleted={isBookCompleted}
              onMarkAsCompleted={handleMarkAsCompleted}
              onCreateNoteFromSelection={handleCreateNoteFromSelection}
            />
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-b from-background to-muted/20">
        <AppSidebar 
          currentBook={currentBibleBook} 
          onPageSelect={handlePageSelect}
          noteCounts={getNoteCounts()}
          tags={sidebarTags}
          chapterLevels={chapterLevels}
          onViewChange={setCurrentView}
        />
        
        {isMobile ? (
          <div className="mobile-content w-full">
            {currentView === 'books' ? (
              renderMobileBookPanel()
            ) : currentView === 'tags' ? (
              <TagPanel tags={sidebarTags} tasks={tasks} />
            ) : (
              <LibraryPanel books={[currentBibleBook]} />
            )}
          </div>
        ) : (
          <ResizablePanelGroup 
            direction={isMobile ? "vertical" : "horizontal"} 
            className="h-screen flex-1"
          >
            <ResizablePanel defaultSize={50} minSize={30} className="h-full">
              <ScrollArea className="h-full">
                <div className="p-4 md:p-6 flex justify-center">
                  <div className="w-full max-w-2xl">
                    <div className="text-center animate-fade-in mb-4">
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">Anote ou Pesquise..</h1>
                      <p className="text-muted-foreground">
                        Organize seu estudo e aprendizado
                      </p>
                    </div>

                    <Tabs 
                      defaultValue="personal" 
                      className="w-full"
                      value={currentTab}
                      onValueChange={(value) => setCurrentTab(value as TabType)}
                    >
                      <div className="relative mb-2">
                        <TabsList className="grid w-full grid-cols-2 h-auto">
                          <TabsTrigger value="personal">
                            Minhas Notas
                          </TabsTrigger>
                          <TabsTrigger value="chat" className="flex items-center gap-2">
                            Chat <Sparkles className="h-4 w-4" />
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="personal" className="tab-content-enter">
                        <div className="space-y-4">
                          <div className="create-task-form">
                            <CreateTask 
                              onCreateTask={handleCreateTask} 
                              existingTags={allTags}
                              onTagCreate={handleTagCreate}
                              initialReference={isCreatingNoteFromSelection ? selectedTextReference : ""}
                              onAfterSubmit={() => {
                                setIsCreatingNoteFromSelection(false);
                                setSelectedTextReference("");
                              }}
                            />
                          </div>
                          
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
                      <TabsContent value="chat" className="tab-content-enter">
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
                    <ContentViewer
                      content={getCurrentPageContent()}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onNextPage={handleNextPage}
                      onPreviousPage={handlePreviousPage}
                      isCompleted={isBookCompleted}
                      onMarkAsCompleted={handleMarkAsCompleted}
                      onCreateNoteFromSelection={handleCreateNoteFromSelection}
                    />
                  </div>
                </div>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}

        <QuizDialog
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          questions={CHAPTER_QUIZZES[0].questions}
          chapterId="genesis"
          onComplete={handleQuizComplete}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
