import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Book, Tag, Plus, X } from "lucide-react";
import { Task } from "./TaskCard";

interface CreateTaskProps {
  onCreateTask: (task: Omit<Task, "id" | "completed" | "inProgress">) => void;
}

const STUDY_TYPES = [
  { value: "study", label: "Estudo Bíblico" },
  { value: "devotional", label: "Devocional" },
  { value: "sermon", label: "Sermão" },
  { value: "other", label: "Outro" },
];

export const CreateTask = ({ onCreateTask }: CreateTaskProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chapter, setChapter] = useState("");
  const [verses, setVerses] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState<string>("");
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
      chapter,
      verses,
      notes: notes.trim(),
      tags,
      type: type as "study" | "devotional" | "sermon" | "other",
    });

    setTitle("");
    setDescription("");
    setChapter("");
    setVerses("");
    setNotes("");
    setTags([]);
    setType("");
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Book className="h-5 w-5 text-primary" />
        <Input
          placeholder="Adicionar novo estudo ou anotação..."
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
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de estudo" />
              </SelectTrigger>
              <SelectContent>
                {STUDY_TYPES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
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
            placeholder="Descrição do estudo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />

          <Textarea
            placeholder="Anotações e reflexões..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] mb-4 resize-none"
          />

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
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
                    className="flex items-center gap-1"
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsExpanded(false);
                setTitle("");
                setDescription("");
                setChapter("");
                setVerses("");
                setNotes("");
                setTags([]);
                setType("");
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Criar Anotação</Button>
          </div>
        </>
      )}
    </form>
  );
};