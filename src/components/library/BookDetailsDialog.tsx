import { Book } from "@/types/Book";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Tag, Upload, BookOpen, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookDetailsDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateBook: (book: Book) => void;
}

export function BookDetailsDialog({ 
  book, 
  open, 
  onOpenChange,
  onUpdateBook 
}: BookDetailsDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate image upload - In a real app, you'd upload to a server
      const imageUrl = URL.createObjectURL(file);
      onUpdateBook({ ...book, coverImage: imageUrl });
      toast({
        title: "Imagem atualizada",
        description: "A capa do documento foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar imagem",
        description: "Não foi possível atualizar a capa do documento.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const progress = (book.completedChapters / book.chapters.length) * 100;
  const totalNotes = book.chapters.reduce((acc, chapter) => 
    acc + (Array.isArray(chapter.notes) ? chapter.notes.length : 0), 
  0);

  // Filter notes by selected tag
  const filteredNotes = book.chapters.flatMap(chapter => 
    (Array.isArray(chapter.notes) ? chapter.notes : []).filter(note => 
      !selectedTag || note.tags?.includes(selectedTag)
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-8rem)]">
          <div className="grid gap-8 py-4 px-6">
            {/* Cover Image Section */}
            <div className="relative h-48 bg-muted rounded-lg overflow-hidden group">
              {book.coverImage ? (
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fallback="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                    alt="Default cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <Button variant="secondary" disabled={isUploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Enviando..." : "Alterar capa"}
                  </Button>
                </label>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="h-5 w-5" />
                  Progresso Geral
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(progress)}% concluído
                </p>
              </div>

              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Brain className="h-5 w-5" />
                  Nível de Domínio
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">
                    {progress >= 80 ? "Avançado" : progress >= 40 ? "Intermediário" : "Iniciante"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="h-5 w-5" />
                  Total de Anotações
                </div>
                <p className="text-2xl font-bold">{totalNotes.toString()}</p>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  key="all" 
                  variant={selectedTag === null ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(null)}
                >
                  Todas
                </Badge>
                {book.tags?.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Anotações</h3>
              <div className="grid gap-4">
                {filteredNotes.map((note, index) => (
                  <div key={index} className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="font-medium">{note.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {note.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapter Progress */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Progresso por Capítulo</h3>
              <div className="grid gap-4">
                {book.chapters.map((chapter) => (
                  <div key={chapter.id} className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {chapter.title || `Capítulo ${chapter.number}`}
                      </span>
                      <Badge variant="secondary">
                        {chapter.quizScore ? `${chapter.quizScore}% no Quiz` : 'Quiz pendente'}
                      </Badge>
                    </div>
                    <Progress 
                      value={(chapter.completedPages / chapter.pages.length) * 100} 
                      className="h-2" 
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {Array.isArray(chapter.notes) ? chapter.notes.length : 0} anotações
                      </span>
                      <span>
                        {chapter.completedPages} de {chapter.pages.length} páginas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}