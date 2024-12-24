import { useState } from "react";
import { ChevronRight, ChevronDown, Folder as FolderIcon, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, Material } from "@/types/Folder";

interface FolderTreeProps {
  folders: Folder[];
  materials: Material[];
  onFolderSelect: (folderId: string) => void;
  onMaterialSelect: (material: Material) => void;
  selectedFolderId?: string;
}

export const FolderTree = ({
  folders,
  materials,
  onFolderSelect,
  onMaterialSelect,
  selectedFolderId
}: FolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: Folder) => {
    const isExpanded = expandedFolders.has(folder.id);
    const folderMaterials = materials.filter(m => m.folderId === folder.id);
    const subFolders = folders.filter(f => f.parentId === folder.id);

    return (
      <div key={folder.id} className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-2",
            selectedFolderId === folder.id && "bg-muted"
          )}
          onClick={() => {
            toggleFolder(folder.id);
            onFolderSelect(folder.id);
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <FolderIcon className="h-4 w-4" />
          <span>{folder.name}</span>
        </Button>

        {isExpanded && (
          <div className="ml-6 space-y-1">
            {subFolders.map(subFolder => renderFolder(subFolder))}
            {folderMaterials.map(material => (
              <Button
                key={material.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => onMaterialSelect(material)}
              >
                <File className="h-4 w-4" />
                <span>{material.title}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = folders.filter(f => !f.parentId);

  return (
    <div className="space-y-2 p-2">
      {rootFolders.map(folder => renderFolder(folder))}
    </div>
  );
};