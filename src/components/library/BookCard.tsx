import { Book } from "@/types/Book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, FileText, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "@/components/ui/image";

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const progress = (book.completedChapters / book.chapters.length) * 100;
  const totalNotes = book.chapters.reduce((acc, chapter) => acc + (chapter.notes || 0), 0);

  return (
    <Card 
      className="hover:bg-accent transition-colors cursor-pointer group relative overflow-hidden" 
      onClick={onClick}
    >
      {book.coverImage && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
          <Image
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground relative z-10">
          <div className="flex items-center justify-between">
            <span>Progresso</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-between">
            <span>Anotações</span>
            <span className="font-medium">{totalNotes}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Nível</span>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">
                {progress >= 80 ? "Avançado" : progress >= 40 ? "Intermediário" : "Iniciante"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}