import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTask } from "./CreateTask";

interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialReference?: string;
}

export function CreateNoteDialog({ isOpen, onClose, initialReference }: CreateNoteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[600px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>Criar Anotação</DialogTitle>
        </DialogHeader>
        <CreateTask
          onCreateTask={(task) => {
            onClose();
          }}
          initialReference={initialReference}
          onAfterSubmit={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}