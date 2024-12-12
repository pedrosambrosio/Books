import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface SidebarChapterProps {
  chapter: {
    id: string;
    number: number;
    title: string;
    pages: Array<{
      id: string;
      number: number;
      completed: boolean;
    }>;
    completedPages: number;
  };
  currentChapterId?: string;
  currentPage?: number;
  onPageSelect?: (pageNumber: number, chapterId: string) => void;
  noteCounts?: {
    bookNotes: number;
    chapterNotes: number;
    pageNotes: number;
  };
}

export function SidebarChapter({
  chapter,
  currentChapterId,
  currentPage,
  onPageSelect,
  noteCounts
}: SidebarChapterProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const { toast } = useToast();

  // Automatically expand the current chapter
  useEffect(() => {
    if (currentChapterId === chapter.id) {
      setExpandedChapter(chapter.id);
    }
  }, [currentChapterId, chapter.id]);

  const handlePageClick = (pageNumber: number, chapterId: string) => {
    if (onPageSelect) {
      onPageSelect(pageNumber, chapterId);
      // Only show toast if changing to a different page
      if (pageNumber !== currentPage || chapterId !== currentChapterId) {
        toast({
          title: "Página selecionada",
          description: `Navegando para a página ${pageNumber}`,
        });
      }
    }
  };

  const isCurrentChapter = currentChapterId === chapter.id;

  return (
    <Collapsible
      open={expandedChapter === chapter.id}
      onOpenChange={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
        >
          {expandedChapter === chapter.id ? (
            <ChevronDown className="h-4 w-4 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2" />
          )}
          <span className={isCurrentChapter ? "text-[#09090B]" : "text-[#71717A]"}>
            {chapter.title}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {noteCounts?.chapterNotes || 0}
            </span>
            <span className="text-xs text-muted-foreground">
              {chapter.completedPages}/{chapter.pages.length}
            </span>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-6 space-y-1">
          {chapter.pages.map((page) => {
            const isCurrentPage = isCurrentChapter && currentPage === page.number;
            return (
              <Button
                key={page.id}
                variant="ghost"
                className={`w-full justify-start text-sm pl-8 ${
                  page.completed || isCurrentPage
                    ? "text-[#09090B] font-medium" 
                    : "text-[#71717A]"
                }`}
                onClick={() => handlePageClick(page.number, chapter.id)}
              >
                <span className="flex items-center gap-2 w-full">
                  <span>Página {page.number}</span>
                  {page.completed && <Check className="h-4 w-4" />}
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-auto">
                    {noteCounts?.pageNotes || 0}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}