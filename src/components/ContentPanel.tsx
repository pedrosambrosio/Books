import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentPanelProps {
  currentPage: number;
  totalPages: number;
  selectedVerses: string[];
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function ContentPanel({
  currentPage,
  totalPages,
  selectedVerses,
  onPreviousPage,
  onNextPage,
}: ContentPanelProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 md:p-6 flex justify-center max-w-full overflow-x-hidden">
        <div className="w-full max-w-2xl">
          <div className="glass-card h-full rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Conteúdo</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPreviousPage}
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
                  onClick={onNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ArrowRight className="h-4 w-4" />
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
  );
}