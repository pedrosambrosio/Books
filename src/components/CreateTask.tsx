import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Tag, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { Task } from "./TaskCard";
import { RichTextEditor } from "./RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTaskProps {
  onCreateTask: (task: Omit<Task, "id" | "completed" | "inProgress">) => void;
  existingTags?: string[];
  onTagCreate?: (tag: string) => void;
  initialReference?: string;
  onAfterSubmit?: () => void;
}

export const CreateTask = ({ 
  onCreateTask, 
  existingTags = [], 
  onTagCreate,
  initialReference = "",
  onAfterSubmit
}: CreateTaskProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState(initialReference);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialReference) {
      setReference(initialReference);
      setIsExpanded(true);
    }
  }, [initialReference]);

  const handleAddTag = (tagToAdd: string = newTag.trim()) => {
    if (!tagToAdd || tags.includes(tagToAdd)) return;
    
    setTags([...tags, tagToAdd]);
    if (onTagCreate && !existingTags.includes(tagToAdd)) {
      onTagCreate(tagToAdd);
    }
    setNewTag("");
    setIsTagDropdownOpen(false);
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
      reference: reference.trim(),
      tags,
    });

    setTitle("");
    setDescription("");
    setReference("");
    setTags([]);
    setIsExpanded(false);
    onAfterSubmit?.();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isExpanded && newTitle) {
      setIsExpanded(true);
    } else if (isExpanded && !newTitle) {
      setIsExpanded(false);
      setDescription("");
      setReference("");
      setTags([]);
    }
  };

  const filteredTags = existingTags.filter(tag => 
    tag.toLowerCase().includes(newTag.toLowerCase()) &&
    !tags.includes(tag)
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Bookmark className="h-5 w-5 text-primary" />
        <Input
          placeholder="Adicionar novo estudo ou anotação..."
          value={title}
          onChange={handleTitleChange}
          className="border-none bg-transparent px-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
        />
      </div>
      {isExpanded && (
        <div className="animate-fade-in">
          <div className="mb-6">
            <Input
              placeholder="Referência (opcional)"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              maxLength={100}
              className="mb-6"
            />
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          <div className="space-y-4 mb-6">
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Input
                    placeholder="Adicionar tag..."
                    value={newTag}
                    onChange={(e) => {
                      setNewTag(e.target.value);
                      setIsTagDropdownOpen(true);
                    }}
                    onFocus={() => setIsTagDropdownOpen(true)}
                    className="pr-8"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-all"
                    onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                  >
                    {isTagDropdownOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-700 rounded-sm transition-transform" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-700 rounded-sm transition-transform" />
                    )}
                  </button>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAddTag()}
                  disabled={!newTag.trim() || tags.includes(newTag.trim())}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {isTagDropdownOpen && filteredTags.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[160px] overflow-y-auto">
                  <div className="py-1">
                    {filteredTags.slice(0, 4).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={() => handleAddTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                setReference("");
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
