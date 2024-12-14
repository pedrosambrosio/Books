import { ScrollArea } from "@/components/ui/scroll-area";
import { MobileMenu } from "./MobileMenu";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MobileChatViewProps {
  currentView: 'books' | 'tags' | 'library';
  onViewChange: (view: 'books' | 'tags' | 'library') => void;
}

export function MobileChatView({ currentView, onViewChange }: MobileChatViewProps) {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-screen bg-background">
      <MobileMenu currentView={currentView} onViewChange={onViewChange} />
      
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Chat em breve... Esta é uma prévia do design.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button size="icon" disabled>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}