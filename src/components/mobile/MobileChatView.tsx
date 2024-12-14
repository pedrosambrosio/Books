import { ScrollArea } from "@/components/ui/scroll-area";

export function MobileChatView() {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)] w-full">
      <div className="p-4 md:p-6 flex justify-center">
        <div className="w-full max-w-2xl space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              Chat em breve...
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}