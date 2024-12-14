import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Book } from "@/types/Book";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { BookCard } from "./library/BookCard";
import { BookDetailsDialog } from "./library/BookDetailsDialog";

interface LibraryPanelProps {
  books: Book[];
  tags?: { name: string; count: number }[];
  onUpdateBook?: (book: Book) => void;
}

export function LibraryPanel({ 
  books, 
  tags = [],
  onUpdateBook 
}: LibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleUpdateBook = (updatedBook: Book) => {
    onUpdateBook?.(updatedBook);
  };

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
                className="cursor-pointer"
                onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
              >
                {tag.name} ({tag.count})
              </Badge>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            ))}
          </div>
        </ScrollArea>

        {selectedBook && (
          <BookDetailsDialog
            book={selectedBook}
            open={!!selectedBook}
            onOpenChange={(open) => !open && setSelectedBook(null)}
            onUpdateBook={handleUpdateBook}
          />
        )}
      </div>
    </div>
  );
}