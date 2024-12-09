import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Book } from "lucide-react";
import { Task, Subtask } from "./TaskCard";

interface CreateTaskProps {
  onCreateTask: (task: Omit<Task, "id" | "completed" | "inProgress">) => void;
}

const BIBLE_BOOKS = [
  "Gênesis",
  "Êxodo",
  "Levítico",
  "Números",
  "Deuteronômio",
  "Salmos",
  "Provérbios",
  "Mateus",
  "Marcos",
  "Lucas",
  "João",
  "Atos",
  "Romanos",
];

export const CreateTask = ({ onCreateTask }: CreateTaskProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verses, setVerses] = useState("");
  const [notes, setNotes] = useState("");
  const [suggestedTime, setSuggestedTime] = useState(15); // Tempo sugerido em minutos

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: `${book} ${chapter}${verses ? `:${verses}` : ""}\n\n${description.trim()}`,
      category: book,
      notes: notes.trim(),
      suggestedTime,
    });

    setTitle("");
    setDescription("");
    setBook("");
    setChapter("");
    setVerses("");
    setNotes("");
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Book className="h-5 w-5 text-primary" />
        <Input
          placeholder="Adicionar nova leitura bíblica..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!isExpanded && e.target.value) setIsExpanded(true);
          }}
          className="border-none bg-transparent px-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
        />
      </div>
      {isExpanded && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select value={book} onValueChange={setBook}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o livro" />
              </SelectTrigger>
              <SelectContent>
                {BIBLE_BOOKS.map((book) => (
                  <SelectItem key={book} value={book}>
                    {book}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Capítulo"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              type="number"
              min="1"
            />
            
            <Input
              placeholder="Versículos (opcional)"
              value={verses}
              onChange={(e) => setVerses(e.target.value)}
            />
          </div>

          <Textarea
            placeholder="Anotações e reflexões..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] mb-4 resize-none"
          />

          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Tempo sugerido de leitura: {suggestedTime} minutos
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSuggestedTime(Math.max(5, suggestedTime - 5))}
              >
                -5min
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSuggestedTime(suggestedTime + 5)}
              >
                +5min
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsExpanded(false);
                setTitle("");
                setDescription("");
                setBook("");
                setChapter("");
                setVerses("");
                setNotes("");
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Criar Leitura</Button>
          </div>
        </>
      )}
    </form>
  );
};