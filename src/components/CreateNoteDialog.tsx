import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTask } from "./CreateTask";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialReference?: string;
}

export function CreateNoteDialog({ isOpen, onClose, initialReference }: CreateNoteDialogProps) {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[600px] w-[95vw] rounded-xl">
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