import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Book, Tag, Edit2, Trash2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  inProgress?: boolean;
  reference?: string;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  isPaused?: boolean;
  category?: string;
  priority?: string;
  subtasks?: Subtask[];
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  totalPages?: number;
  currentPage?: number;
}

export const TaskCard = ({ 
  task, 
  onUpdate, 
  onComplete, 
  onDelete,
  onNextPage,
  onPreviousPage,
  totalPages,
  currentPage,
}: TaskCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const toggleTag = (tag: string) => {
    const currentTags = task.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onUpdate({ ...task, tags: newTags });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
      setIsDetailsOpen(false);
      toast({
        title: "Anotação excluída",
        description: "A anotação foi excluída com sucesso.",
      });
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(task.id);
      toast({
        title: task.completed ? "Marcado como pendente" : "Marcado como concluído",
        description: `A anotação foi marcada como ${task.completed ? "pendente" : "concluída"}.`,
      });
    }
  };

  const previewDescription = task.description?.split('\n').slice(0, 2).join('\n');

  return (
    <>
      <div 
        className="rounded-lg p-6 hover-scale cursor-pointer bg-white border border-zinc-200 relative group"
      >
        {totalPages && currentPage && (
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onPreviousPage?.();
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                onNextPage?.();
              }}
              disabled={currentPage === totalPages}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
          >
            <CheckCircle className={`h-4 w-4 ${task.completed ? "text-green-500" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsOpen(true);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-4" onClick={() => setIsDetailsOpen(true)}>
          <h3 className="font-medium text-lg">{task.title}</h3>
          
          {task.reference && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Book className="h-4 w-4" />
              <span>{task.reference}</span>
            </div>
          )}

          {previewDescription && (
            <div 
              className="text-sm text-muted-foreground line-clamp-2"
              dangerouslySetInnerHTML={{ __html: previewDescription }}
            />
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleComplete}
                >
                  <CheckCircle className={`h-4 w-4 ${task.completed ? "text-green-500" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Implement edit functionality
                    setIsDetailsOpen(false);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6 py-6">
            {task.reference && (
              <div className="flex items-center gap-2 text-sm">
                <Book className="h-4 w-4" />
                <span>{task.reference}</span>
              </div>
            )}
            
            {task.description && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Tags</h4>
                <div className="flex flex-wrap gap-3">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer px-3 py-1"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};