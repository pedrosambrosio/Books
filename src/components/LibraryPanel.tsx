import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Book } from "@/types/Book";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LibraryPanelProps {
  books: Book[];
}

export function LibraryPanel({ books }: LibraryPanelProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold">Biblioteca</h2>
          <p className="text-muted-foreground">
            Explore sua coleção de livros
          </p>
          <Input type="search" placeholder="Buscar livro..." className="max-w-md mx-auto" />
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {books.map((book) => (
              <Card key={book.id} className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {book.completedChapters} / {book.chapters.length} capítulos
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