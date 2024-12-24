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
import { FolderTree } from "@/components/folders/FolderTree";
import { Folder, Material } from "@/types/Folder";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContentViewer } from "@/components/ContentViewer";
import { TagPanel } from "@/components/TagPanel";
import { LibraryPanel } from "@/components/LibraryPanel";
import { MobileMenu } from "@/components/mobile/MobileMenu";
import { MobileChatView } from "@/components/mobile/MobileChatView";
import { BIBLE_BOOK } from "@/data/mockData";
import { GENESIS_CONTENT } from "@/data/bibleContent";
import { ViewType, TabType, MobileViewType } from "@/types/ViewTypes";
import { QuizResult } from "@/types/Quiz";

// Mock data for demonstration
const MOCK_FOLDERS: Folder[] = [
  {
    id: "1",
    name: "Onboarding",
    description: "Materiais de onboarding",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Treinamentos Técnicos",
    description: "Materiais técnicos",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const MOCK_MATERIALS: Material[] = [
  {
    id: "1",
    title: "Guia de Boas-vindas",
    type: "pdf",
    folderId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Políticas da Empresa",
    type: "doc",
    folderId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

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
  const [mobileView, setMobileView] = useState<MobileViewType>('bible');
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const [selectedMaterial, setSelectedMaterial] = useState<Material>();

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

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material);
    // Aqui você pode carregar o conteúdo do material
  };

  // Transform tagCounts into the format expected by AppSidebar
  const sidebarTags = Object.entries(tagCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count
    }));

  const renderMobileContent = () => {
    if (mobileView === 'chat') {
      return (
        <MobileChatView 
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      );
    }

    return (
      <div className="flex flex-col h-screen pb-16">
        <MobileMenu currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 overflow-hidden">
          {currentView === 'books' ? (
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
          ) : currentView === 'tags' ? (
            <TagPanel tags={sidebarTags} tasks={tasks} />
          ) : (
            <LibraryPanel books={[currentBibleBook]} />
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
          <div className="max-w-md mx-auto flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentTab('personal')}
              className={cn(
                "flex-1 bg-background",
                currentTab === 'personal' && "bg-white dark:bg-zinc-800"
              )}
            >
              Minhas Notas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentTab('chat')}
              className={cn(
                "flex-1 bg-background",
                currentTab === 'chat' && "bg-white dark:bg-zinc-800"
              )}
            >
              Chat
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-b from-background to-muted/20">
        {isMobile ? (
          renderMobileContent()
        ) : (
          <>
            <AppSidebar
              currentBook={currentBibleBook}
              onPageSelect={handlePageSelect}
              noteCounts={getNoteCounts()}
              tags={sidebarTags}
              chapterLevels={chapterLevels}
              onViewChange={setCurrentView}
            >
              <FolderTree
                folders={MOCK_FOLDERS}
                materials={MOCK_MATERIALS}
                onFolderSelect={handleFolderSelect}
                onMaterialSelect={handleMaterialSelect}
                selectedFolderId={selectedFolder}
              />
            </AppSidebar>
            
            <ResizablePanelGroup 
              direction="horizontal" 
              className="h-screen flex-1"
            >
              <ResizablePanel defaultSize={50} minSize={30} className="h-full">
                <ScrollArea className="h-full">
                  <div className="p-4 md:p-6 flex justify-center">
                    <div className="w-full max-w-2xl">
                      <div className="text-center animate-fade-in mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                          {selectedMaterial ? selectedMaterial.title : "Selecione um material"}
                        </h1>
                        <p className="text-muted-foreground">
                          Faça anotações e organize seu aprendizado
                        </p>
                      </div>

                      <Tabs 
                        defaultValue="personal" 
                        className="w-full"
                        value={currentTab}
                        onValueChange={(value) => setCurrentTab(value as TabType)}
                      >
                        <TabsList className="grid w-full grid-cols-2 h-auto">
                          <TabsTrigger value="personal">
                            Minhas Notas
                          </TabsTrigger>
                          <TabsTrigger value="chat" className="flex items-center gap-2">
                            Chat <Sparkles className="h-4 w-4" />
                          </TabsTrigger>
                        </TabsList>
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
                      {selectedMaterial ? (
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
                      ) : (
                        <div className="text-center text-muted-foreground">
                          Selecione um material para começar
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </ResizablePanel>
            </ResizablePanelGroup>
          </>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;