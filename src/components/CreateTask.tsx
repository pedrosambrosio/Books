import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Book, Tag, Plus, X } from "lucide-react";
import { Task } from "./TaskCard";
import { RichTextEditor } from "./RichTextEditor";

interface CreateTaskProps {
  onCreateTask: (task: Omit<Task, "id" | "completed" | "inProgress">) => void;
}

export const CreateTask = ({ onCreateTask }: CreateTaskProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [verseStart, setVerseStart] = useState("");
  const [verseEnd, setVerseEnd] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return;
    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      verses: verseStart && verseEnd ? `${verseStart}-${verseEnd}` : verseStart || "",
      tags,
    });

    setTitle("");
    setDescription("");
    setVerseStart("");
    setVerseEnd("");
    setTags([]);
    setIsExpanded(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isExpanded && newTitle) {
      setIsExpanded(true);
    } else if (isExpanded && !newTitle) {
      setIsExpanded(false);
      setDescription("");
      setVerseStart("");
      setVerseEnd("");
      setTags([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Book className="h-5 w-5 text-primary" />
        <Input
          placeholder="Adicionar novo estudo ou anotação..."
          value={title}
          onChange={handleTitleChange}
          className="border-none bg-transparent px-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
        />
      </div>
      {isExpanded && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Versículo inicial"
              value={verseStart}
              onChange={(e) => setVerseStart(e.target.value)}
              type="number"
              min="1"
            />
            <Input
              placeholder="Versículo final (opcional)"
              value={verseEnd}
              onChange={(e) => setVerseEnd(e.target.value)}
              type="number"
              min="1"
            />
          </div>

          <div className="mb-6">
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Adicionar tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsExpanded(false);
                setTitle("");
                setDescription("");
                setVerseStart("");
                setVerseEnd("");
                setTags([]);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Criar Anotação</Button>
          </div>
        </div>
      )}
    </form>
  );
};