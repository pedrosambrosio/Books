import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Book } from "@/types/Book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface LibraryPanelProps {
  books: Book[];
}

export function LibraryPanel({ books }: LibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold">Biblioteca</h2>
          <p className="text-muted-foreground">
            Explore sua coleção de livros
          </p>
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Input 
                type="search" 
                placeholder="Buscar livro..." 
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
                  <DialogTitle>Adicionar Livro</DialogTitle>
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
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {books.map((book) => (
              <Card key={book.id} className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Progresso</span>
                      <span className="font-medium">{Math.round((book.completedChapters / book.chapters.length) * 100)}%</span>
                    </div>
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
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}