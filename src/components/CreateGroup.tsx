import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Group } from "@/types/GroupTask";

interface CreateGroupProps {
  onCreateGroup: (group: Omit<Group, "id" | "members">) => void;
}

export const CreateGroup = ({ onCreateGroup }: CreateGroupProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    onCreateGroup({
      name: name.trim(),
      description: description.trim(),
      inviteCode
    });

    setName("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create New Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-2"
            />
          </div>
          <div>
            <Textarea
              placeholder="Group Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!name.trim()}>
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};