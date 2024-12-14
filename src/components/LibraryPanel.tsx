import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Book } from "@/types/Book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText, Award, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface LibraryPanelProps {
  books: Book[];
  tags?: { name: string; count: number }[];
}

export function LibraryPanel({ books, tags = [] }: LibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || book.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold">Biblioteca</h2>
          <p className="text-muted-foreground">
            Explore sua coleção de Documentos e veja suas anotações organizadas
          </p>
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Input 
                type="search" 
                placeholder="Buscar documento..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-black"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Documento</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Word
                  </Button>
                  <Button className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    ePub
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={selectedTag === null ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(null)}
            >
              Todos
            </Badge>
            {tags.map((tag) => (
              <Badge
                key={tag.name}
                variant={selectedTag === tag.name ? "default" : "secondary"}
                className="cursor-pointer flex items-center gap-1"
                onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
              >
                <Tag className="h-3 w-3" />
                {tag.name} ({tag.count})
              </Badge>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {filteredBooks.map((book) => (
              <Dialog key={book.id} onOpenChange={(open) => !open && setSelectedBook(null)}>
                <DialogTrigger asChild>
                  <Card className="hover:bg-accent transition-colors cursor-pointer" onClick={() => setSelectedBook(book)}>
                    <CardHeader>
                      <CardTitle>{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Progresso</span>
                          <span className="font-medium">{Math.round((book.completedChapters / book.chapters.length) * 100)}%</span>
                        </div>
                        <Progress value={(book.completedChapters / book.chapters.length) * 100} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span>Anotações</span>
                          <span className="font-medium">{book.chapters.reduce((acc, chapter) => acc + (chapter.notes || 0), 0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Nível</span>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">Intermediário</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                {selectedBook && (
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{selectedBook.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6">
                      {/* Progress Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Progresso</h3>
                        <Progress value={(selectedBook.completedChapters / selectedBook.chapters.length) * 100} className="h-2" />
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Capítulos Concluídos</p>
                            <p className="font-medium">{selectedBook.completedChapters}/{selectedBook.chapters.length}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Total de Anotações</p>
                            <p className="font-medium">{selectedBook.chapters.reduce((acc, chapter) => acc + (chapter.notes || 0), 0)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground">Nível Atual</p>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">Intermediário</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tags Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedBook.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Quiz Results */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Resultados dos Quizzes</h3>
                        <div className="grid gap-4">
                          {selectedBook.chapters.map((chapter) => (
                            <div key={chapter.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                              <span>{chapter.title || `Capítulo ${chapter.number}`}</span>
                              <Badge variant="secondary">
                                {chapter.quizScore ? `${chapter.quizScore}%` : 'Não realizado'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}